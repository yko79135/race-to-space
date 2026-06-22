// ============================================================
// GAME STATE MANAGEMENT
// ============================================================
import { buildMainDeck, buildEventDeck, shuffleDeck, getPlayerStage, missions } from './gameData';

export const MAX_HAND_SIZE = 10;
export const MAX_PLAYS_PER_TURN = 3;
export const MAX_DISCARDS_PER_TURN = 2;

// Draw `count` cards for a player, skipping cards they haven't unlocked yet (stage-gated).
// Skipped cards stay in the deck in their original position — deck never stalls.
function drawEligibleCards(deck, count, playerStage = 1) {
  const drawn = [];
  const remaining = [];
  for (const card of deck) {
    if (drawn.length < count && (!card.requiresStage || card.requiresStage <= playerStage)) {
      drawn.push(card);
    } else {
      remaining.push(card);
    }
  }
  return { drawn, remaining };
}

// Ensure deck has at least `needed` cards by reshuffling discard pile into it
function ensureDeck(deck, discard, needed) {
  if (deck.length < needed && discard.length > 0) {
    return { deck: [...deck, ...shuffleDeck(discard)], discard: [] };
  }
  return { deck, discard };
}

export function createPlayer(name, colorId, emblem) {
  return {
    id: `player_${Math.random().toString(36).slice(2, 7)}`,
    name,
    colorId,
    emblem,
    resources: { science: 0, money: 0, consensus: 0 },
    hand: [],
    unlockedTechs: [],
    completedMissions: [],
    stage: 1,
  };
}

export function createGameState(players) {
  const mainDeck = buildMainDeck();
  const eventDeck = buildEventDeck();

  // Deal initial 5 cards to each player (all start at stage 1)
  let deckCopy = [...mainDeck];
  const playersWithHands = players.map(p => {
    const { drawn, remaining } = drawEligibleCards(deckCopy, 5, p.stage);
    deckCopy = remaining;
    return { ...p, hand: drawn };
  });

  return {
    players: playersWithHands,
    currentPlayerIndex: 0,
    turn: 1,
    mainDeck: deckCopy,
    discardPile: [],
    eventDeck,
    usedEvents: [],
    phase: 'draw', // draw | play | event | transition | gameover
    playsThisTurn: 0,
    discardsThisTurn: 0,
    lastEvent: null,
    winner: null,
    pendingAction: null, // for target-selection actions
    log: [],
  };
}

export function getCurrentPlayer(state) {
  return state.players[state.currentPlayerIndex];
}

// Draw until hand = 10, return new state
export function drawToFull(state) {
  const player = getCurrentPlayer(state);
  const needed = MAX_HAND_SIZE - player.hand.length;
  if (needed <= 0) return { ...state, phase: 'play' };

  let { deck, discard } = ensureDeck([...state.mainDeck], [...state.discardPile], needed);

  const { drawn, remaining } = drawEligibleCards(deck, needed, player.stage);
  deck = remaining;
  const newHand = [...player.hand, ...drawn];

  const updatedPlayers = state.players.map((p, i) =>
    i === state.currentPlayerIndex ? { ...p, hand: newHand } : p
  );

  return {
    ...state,
    players: updatedPlayers,
    mainDeck: deck,
    discardPile: discard,
    phase: 'play',
  };
}

export function drawExtraCards(state, count) {
  const player = getCurrentPlayer(state);
  const canDraw = MAX_HAND_SIZE - player.hand.length;
  const toDraw = Math.min(count, canDraw);
  if (toDraw <= 0) return state;

  let { deck, discard } = ensureDeck([...state.mainDeck], [...state.discardPile], toDraw);

  const { drawn, remaining } = drawEligibleCards(deck, toDraw, player.stage);
  deck = remaining;
  const newHand = [...player.hand, ...drawn];

  const updatedPlayers = state.players.map((p, i) =>
    i === state.currentPlayerIndex ? { ...p, hand: newHand } : p
  );

  return { ...state, players: updatedPlayers, mainDeck: deck, discardPile: discard };
}

export function applyResources(players, playerIndex, delta) {
  return players.map((p, i) => {
    if (i !== playerIndex) return p;
    return {
      ...p,
      resources: {
        science: Math.max(0, p.resources.science + (delta.science || 0)),
        money: Math.max(0, p.resources.money + (delta.money || 0)),
        consensus: Math.max(0, p.resources.consensus + (delta.consensus || 0)),
      },
    };
  });
}

export function applyResourcesByPlayerId(players, playerId, delta) {
  return players.map(p => {
    if (p.id !== playerId) return p;
    return {
      ...p,
      resources: {
        science: Math.max(0, p.resources.science + (delta.science || 0)),
        money: Math.max(0, p.resources.money + (delta.money || 0)),
        consensus: Math.max(0, p.resources.consensus + (delta.consensus || 0)),
      },
    };
  });
}

export function playCard(state, card) {
  // For target cards, don't consume action yet — set pending instead
  if (card.actionType === 'targetBoth' || card.actionType === 'targetOther') {
    return {
      ...state,
      pendingAction: { card },
    };
  }

  // For exchange cards, set pending with type so UI can handle selection
  if (card.actionType === 'exchangeCards') {
    return {
      ...state,
      pendingAction: { card, type: 'exchangeCards', selectedUids: [] },
    };
  }

  const player = getCurrentPlayer(state);
  const newHand = player.hand.filter(c => c.uid !== card.uid);
  const newDiscard = [...state.discardPile, card];

  let players = state.players.map((p, i) =>
    i === state.currentPlayerIndex ? { ...p, hand: newHand } : p
  );

  // Apply resource effects
  if (card.type === 'resource' && card.effect) {
    players = applyResources(players, state.currentPlayerIndex, card.effect);
  }
  if (card.type === 'action') {
    if (card.actionType === 'gainResource') {
      players = applyResources(players, state.currentPlayerIndex, card.effect);
    }
    // draw2 handled separately after state update
  }

  return {
    ...state,
    players,
    discardPile: newDiscard,
    playsThisTurn: state.playsThisTurn + 1,
  };
}

// Resolve a pending target card after a target player has been chosen
export function resolveTargetCard(state, targetPlayerId) {
  const { pendingAction } = state;
  if (!pendingAction) return state;

  const card = pendingAction.card;
  const currentIdx = state.currentPlayerIndex;
  const targetIdx = state.players.findIndex(p => p.id === targetPlayerId);

  const newHand = state.players[currentIdx].hand.filter(c => c.uid !== card.uid);
  const newDiscard = [...state.discardPile, card];

  let players = state.players.map((p, i) =>
    i === currentIdx ? { ...p, hand: newHand } : p
  );

  if (card.actionType === 'targetBoth') {
    // Both current player and target gain the resource
    players = applyResources(players, currentIdx, card.effect);
    players = applyResources(players, targetIdx, card.effect);
  } else if (card.actionType === 'targetOther') {
    // Only target is affected (can be negative)
    players = applyResources(players, targetIdx, card.effect);
  }

  return {
    ...state,
    players,
    discardPile: newDiscard,
    playsThisTurn: state.playsThisTurn + 1,
    pendingAction: null,
  };
}

// Resolve a Research Team exchange: discard selected cards, draw replacements
export function resolveExchangeCards(state, selectedUids) {
  const { pendingAction } = state;
  if (!pendingAction) return state;

  const card = pendingAction.card;
  const currentIdx = state.currentPlayerIndex;
  const player = state.players[currentIdx];

  // Remove the Research Team card + selected cards from hand
  const removedUids = new Set([card.uid, ...selectedUids]);
  let newHand = player.hand.filter(c => !removedUids.has(c.uid));
  const discarded = player.hand.filter(c => removedUids.has(c.uid));
  const newDiscard = [...state.discardPile, ...discarded];

  // Draw replacements (one per selected card)
  let { deck, discard: discardPile } = ensureDeck([...state.mainDeck], [...newDiscard], selectedUids.length);
  const { drawn, remaining } = drawEligibleCards(deck, selectedUids.length, player.stage);
  deck = remaining;
  newHand = [...newHand, ...drawn];

  const players = state.players.map((p, i) =>
    i === currentIdx ? { ...p, hand: newHand } : p
  );

  return {
    ...state,
    players,
    mainDeck: deck,
    discardPile: discardPile,
    playsThisTurn: state.playsThisTurn + 1,
    pendingAction: null,
  };
}

export function discardCard(state, card) {
  const player = getCurrentPlayer(state);
  const newHand = player.hand.filter(c => c.uid !== card.uid);
  const newDiscard = [...state.discardPile, card];

  const players = state.players.map((p, i) =>
    i === state.currentPlayerIndex ? { ...p, hand: newHand } : p
  );

  return {
    ...state,
    players,
    discardPile: newDiscard,
    discardsThisTurn: state.discardsThisTurn + 1,
  };
}

export function buyTechnology(state, tech) {
  const player = getCurrentPlayer(state);
  const cost = tech.cost;

  // Deduct resources
  let players = applyResources(state.players, state.currentPlayerIndex, {
    science: -cost.science,
    money: -cost.money,
    consensus: -cost.consensus,
  });

  // Apply dead-end bonus immediately
  if (tech.bonus) {
    players = applyResources(players, state.currentPlayerIndex, tech.bonus);
  }

  // Add tech + update stage
  const newTechs = [...player.unlockedTechs, tech.id];
  const newStage = getPlayerStage(newTechs);

  players = players.map((p, i) =>
    i === state.currentPlayerIndex
      ? { ...p, unlockedTechs: newTechs, stage: newStage }
      : p
  );

  return {
    ...state,
    players,
    playsThisTurn: state.playsThisTurn + 1,
  };
}

export function completeMission(state, mission) {
  const player = getCurrentPlayer(state);
  const cost = mission.cost;

  let players = applyResources(state.players, state.currentPlayerIndex, {
    science: -cost.science,
    money: -cost.money,
    consensus: -cost.consensus,
  });

  const newMissions = [...player.completedMissions, mission.id];
  players = players.map((p, i) =>
    i === state.currentPlayerIndex ? { ...p, completedMissions: newMissions } : p
  );

  // Check win condition
  const winner = newMissions.includes('crewed_spaceflight') ? player.id : null;

  return {
    ...state,
    players,
    playsThisTurn: state.playsThisTurn + 1,
    winner,
    phase: winner ? 'gameover' : state.phase,
  };
}

export function applyEvent(state, event) {
  let players = [...state.players];
  const currentIdx = state.currentPlayerIndex;

  if (event.effect.type === 'current') {
    players = applyResources(players, currentIdx, event.effect.resources);
  } else if (event.effect.type === 'all') {
    players = players.map((_, i) => applyResources(players, i, event.effect.resources)[i]);
  }

  return { ...state, players, lastEvent: event };
}

export function drawEvent(state) {
  let eventDeck = [...state.eventDeck];
  let usedEvents = [...state.usedEvents];

  if (eventDeck.length === 0) {
    eventDeck = shuffleDeck([...usedEvents]);
    usedEvents = [];
  }

  const event = eventDeck.shift();
  usedEvents.push(event);

  const newState = applyEvent({ ...state, eventDeck, usedEvents }, event);
  return { ...newState, phase: 'eventReveal', lastEvent: event };
}

export function endTurn(state) {
  const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
  const nextTurn = nextIndex === 0 ? state.turn + 1 : state.turn;

  return {
    ...state,
    currentPlayerIndex: nextIndex,
    turn: nextTurn,
    phase: 'transition',
    playsThisTurn: 0,
    discardsThisTurn: 0,
    lastEvent: null,
  };
}

export function canBuyTech(player, tech) {
  const r = player.resources;
  const c = tech.cost;
  const hasResources = r.science >= c.science && r.money >= c.money && r.consensus >= c.consensus;
  const hasPrereqs = tech.prereqs.every(p => player.unlockedTechs.includes(p));
  const notOwned = !player.unlockedTechs.includes(tech.id);
  return hasResources && hasPrereqs && notOwned;
}

export function canAttemptMission(player, mission) {
  const r = player.resources;
  const c = mission.cost;
  const hasResources = r.science >= c.science && r.money >= c.money && r.consensus >= c.consensus;
  const hasTechs = mission.reqTechs.every(t => player.unlockedTechs.includes(t));
  const hasPrevMissions = !mission.reqMissions || mission.reqMissions.every(m => player.completedMissions.includes(m));
  const notCompleted = !player.completedMissions.includes(mission.id);
  return hasResources && hasTechs && hasPrevMissions && notCompleted;
}