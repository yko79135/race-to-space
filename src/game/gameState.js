// ============================================================
// GAME STATE MANAGEMENT
// ============================================================
import { buildMainDeck, buildEventDeck, shuffleDeck, getPlayerStage, missions, technologies } from './gameData';
import {
  getFinalTechCost,
  getFinalMissionCost,
  getStartOfTurnBonus,
  getMaxDiscards,
  getMissionCompletionBonus,
  getOtherPlayerMissionBonus,
  applyEventProtection,
} from './techEffects';

export const MAX_HAND_SIZE = 10;
export const MAX_PLAYS_PER_TURN = 3;
export const BASE_DISCARDS_PER_TURN = 2;

// Convenience re-export so GameBoard can still import MAX_DISCARDS_PER_TURN
export const MAX_DISCARDS_PER_TURN = BASE_DISCARDS_PER_TURN;

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
    // Per-turn bonus tracking flags (reset each turn)
    usedScienceCardDrawBonus: false,
    usedMoneyCardBonus: false,
    usedConsensusCardBonus: false,
    electricityChoice: 'money', // 'science' | 'money' — set by UI before turn start
  };
}

export function createGameState(players) {
  const mainDeck = buildMainDeck();
  const eventDeck = buildEventDeck();

  let deckCopy = [...mainDeck];
  const playersWithHands = players.map(p => {
    const hand = deckCopy.splice(0, 5);
    return { ...p, hand };
  });

  return {
    players: playersWithHands,
    currentPlayerIndex: 0,
    turn: 1,
    mainDeck: deckCopy,
    discardPile: [],
    eventDeck,
    usedEvents: [],
    phase: 'draw',
    playsThisTurn: 0,
    discardsThisTurn: 0,
    lastEvent: null,
    winner: null,
    log: [],
    chemistryProtectionUsed: false, // reset each turn
  };
}

export function getCurrentPlayer(state) {
  return state.players[state.currentPlayerIndex];
}

// ── Resource Helpers ──────────────────────────────────────────────────────────
export function applyResources(players, playerIndex, delta) {
  return players.map((p, i) => {
    if (i !== playerIndex) return p;
    return {
      ...p,
      resources: {
        science:   Math.max(0, p.resources.science   + (delta.science   || 0)),
        money:     Math.max(0, p.resources.money     + (delta.money     || 0)),
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
        science:   Math.max(0, p.resources.science   + (delta.science   || 0)),
        money:     Math.max(0, p.resources.money     + (delta.money     || 0)),
        consensus: Math.max(0, p.resources.consensus + (delta.consensus || 0)),
      },
    };
  });
}

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawToFull(state) {
  const player = getCurrentPlayer(state);

  // Apply start-of-turn bonuses when drawing (= start of turn)
  const startBonus = getStartOfTurnBonus(player);
  // Electricity choice is stored on the player
  if (player.unlockedTechs.includes('electricity')) { // electricity id unchanged
    const choice = player.electricityChoice || 'money';
    startBonus[choice] = (startBonus[choice] || 0) + 1;
  }

  let players = state.players.map((p, i) => {
    if (i !== state.currentPlayerIndex) return p;
    return {
      ...p,
      resources: {
        science:   Math.max(0, p.resources.science   + (startBonus.science   || 0)),
        money:     Math.max(0, p.resources.money     + (startBonus.money     || 0)),
        consensus: Math.max(0, p.resources.consensus + (startBonus.consensus || 0)),
      },
      usedScienceCardDrawBonus: false,
      usedMoneyCardBonus: false,
      usedConsensusCardBonus: false,
    };
  });

  const updatedPlayer = players[state.currentPlayerIndex];
  const needed = MAX_HAND_SIZE - updatedPlayer.hand.length;

  // Satellites: draw 1 extra card (within hand limit)
  const extraDraw = updatedPlayer.unlockedTechs.includes('satellites') ? 1 : 0;
  const totalDraw = Math.min(needed + extraDraw, MAX_HAND_SIZE - updatedPlayer.hand.length);

  if (totalDraw <= 0) return { ...state, players, phase: 'play', chemistryProtectionUsed: false };

  let deck = [...state.mainDeck];
  let discard = [...state.discardPile];

  if (deck.length < totalDraw && discard.length > 0) {
    deck = [...deck, ...shuffleDeck(discard)];
    discard = [];
  }

  const drawn = deck.splice(0, Math.min(totalDraw, deck.length));
  const newHand = [...updatedPlayer.hand, ...drawn];

  players = players.map((p, i) =>
    i === state.currentPlayerIndex ? { ...p, hand: newHand } : p
  );

  return {
    ...state,
    players,
    mainDeck: deck,
    discardPile: discard,
    phase: 'play',
    chemistryProtectionUsed: false,
  };
}

export function drawExtraCards(state, count) {
  const player = getCurrentPlayer(state);
  const canDraw = MAX_HAND_SIZE - player.hand.length;
  const toDraw = Math.min(count, canDraw);
  if (toDraw <= 0) return state;

  let deck = [...state.mainDeck];
  let discard = [...state.discardPile];

  if (deck.length < toDraw && discard.length > 0) {
    deck = [...deck, ...shuffleDeck(discard)];
    discard = [];
  }

  const drawn = deck.splice(0, Math.min(toDraw, deck.length));
  const newHand = [...player.hand, ...drawn];

  const updatedPlayers = state.players.map((p, i) =>
    i === state.currentPlayerIndex ? { ...p, hand: newHand } : p
  );

  return { ...state, players: updatedPlayers, mainDeck: deck, discardPile: discard };
}

// ── Play Card ─────────────────────────────────────────────────────────────────
export function playCard(state, card) {
  const playerIndex = state.currentPlayerIndex;
  const player = getCurrentPlayer(state);
  const newHand = player.hand.filter(c => c.uid !== card.uid);
  const newDiscard = [...state.discardPile, card];

  let players = state.players.map((p, i) =>
    i === playerIndex ? { ...p, hand: newHand } : p
  );

  let scienceCardDrawTriggered = false;

  if (card.type === 'resource' && card.effect) {
    let delta = { ...card.effect };

    // Spoken Language: first consensus card gives +1 consensus
    if (card.subtype === 'consensus' && !players[playerIndex].usedConsensusCardBonus
        && players[playerIndex].unlockedTechs.includes('spoken_language')) {
      delta.consensus = (delta.consensus || 0) + 1;
      players = players.map((p, i) => i === playerIndex ? { ...p, usedConsensusCardBonus: true } : p);
    }

    // Steam Power: first money card gives +1 money
    if (card.subtype === 'money' && !players[playerIndex].usedMoneyCardBonus
        && players[playerIndex].unlockedTechs.includes('steam')) {
      delta.money = (delta.money || 0) + 1;
      players = players.map((p, i) => i === playerIndex ? { ...p, usedMoneyCardBonus: true } : p);
    }

    players = applyResources(players, playerIndex, delta);

    // Scientific Experiments: draw 1 after first science card
    if ((card.subtype === 'science' || (delta.science || 0) > 0)
        && !players[playerIndex].usedScienceCardDrawBonus
        && players[playerIndex].unlockedTechs.includes('experiments')) {
      scienceCardDrawTriggered = true;
      players = players.map((p, i) => i === playerIndex ? { ...p, usedScienceCardDrawBonus: true } : p);
    }
  }

  if (card.type === 'action') {
    if (card.actionType === 'gainResource') {
      players = applyResources(players, playerIndex, card.effect);
    }
    // draw2 handled after state update in GameBoard
  }

  let newState = {
    ...state,
    players,
    discardPile: newDiscard,
    playsThisTurn: state.playsThisTurn + 1,
  };

  // Scientific Experiments draw
  if (scienceCardDrawTriggered) {
    newState = drawExtraCards(newState, 1);
  }

  return newState;
}

// ── Discard Card ──────────────────────────────────────────────────────────────
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

// ── Buy Technology ────────────────────────────────────────────────────────────
export function buyTechnology(state, tech) {
  const player = getCurrentPlayer(state);
  // Use centralized final cost (includes all discounts)
  const cost = getFinalTechCost(player, tech);

  let players = applyResources(state.players, state.currentPlayerIndex, {
    science:   -cost.science,
    money:     -cost.money,
    consensus: -cost.consensus,
  });

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

// ── Complete Mission ──────────────────────────────────────────────────────────
export function completeMission(state, mission) {
  const playerIndex = state.currentPlayerIndex;
  const player = getCurrentPlayer(state);

  // Use centralized final cost (includes mission discounts)
  const cost = getFinalMissionCost(player, mission);

  let players = applyResources(state.players, playerIndex, {
    science:   -cost.science,
    money:     -cost.money,
    consensus: -cost.consensus,
  });

  const newMissions = [...player.completedMissions, mission.id];
  players = players.map((p, i) =>
    i === playerIndex ? { ...p, completedMissions: newMissions } : p
  );

  // Radio: current player gains +2 Consensus on mission completion
  const missionBonus = getMissionCompletionBonus(players[playerIndex]);
  if (missionBonus.consensus > 0 || missionBonus.science > 0 || missionBonus.money > 0) {
    players = applyResources(players, playerIndex, missionBonus);
  }

  // Life Support: all other players who own it gain +1 Consensus
  players = players.map((p, i) => {
    if (i === playerIndex) return p;
    const otherBonus = getOtherPlayerMissionBonus(p);
    if (otherBonus.consensus > 0 || otherBonus.science > 0 || otherBonus.money > 0) {
      return {
        ...p,
        resources: {
          science:   Math.max(0, p.resources.science   + (otherBonus.science   || 0)),
          money:     Math.max(0, p.resources.money     + (otherBonus.money     || 0)),
          consensus: Math.max(0, p.resources.consensus + (otherBonus.consensus || 0)),
        },
      };
    }
    return p;
  });

  const winner = newMissions.includes('crewed_spaceflight') ? player.id : null;

  return {
    ...state,
    players,
    playsThisTurn: state.playsThisTurn + 1,
    winner,
    phase: winner ? 'gameover' : state.phase,
  };
}

// ── Events ────────────────────────────────────────────────────────────────────
export function applyEvent(state, event) {
  let players = [...state.players];
  const currentIdx = state.currentPlayerIndex;

  if (event.effect.type === 'current') {
    let delta = { ...event.effect.resources };
    // Chemistry: reduce negative loss by 1 (once per turn)
    if (!state.chemistryProtectionUsed) {
      const protectedDelta = applyEventProtection(players[currentIdx], delta, false);
      if (JSON.stringify(protectedDelta) !== JSON.stringify(delta)) {
        delta = protectedDelta;
        state = { ...state, chemistryProtectionUsed: true };
      }
    }
    players = applyResources(players, currentIdx, delta);
  } else if (event.effect.type === 'all') {
    players = players.map((p, i) => {
      let delta = { ...event.effect.resources };
      // Chemistry protection applies per-player for that player's negative events
      if (!state.chemistryProtectionUsed && i === currentIdx) {
        delta = applyEventProtection(p, delta, false);
      }
      return applyResources(players, i, delta)[i];
    });
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

// ── End Turn ──────────────────────────────────────────────────────────────────
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
    chemistryProtectionUsed: false,
  };
}

// ── Affordability (exported for UI checks) ────────────────────────────────────
export function canBuyTech(player, tech) {
  const cost = getFinalTechCost(player, tech);
  const r = player.resources;
  const hasResources = r.science >= cost.science && r.money >= cost.money && r.consensus >= cost.consensus;
  const hasPrereqs = tech.prereqs.every(p => player.unlockedTechs.includes(p));
  const notOwned = !player.unlockedTechs.includes(tech.id);
  return hasResources && hasPrereqs && notOwned;
}

export function canAttemptMission(player, mission) {
  const cost = getFinalMissionCost(player, mission);
  const r = player.resources;
  const hasResources = r.science >= cost.science && r.money >= cost.money && r.consensus >= cost.consensus;
  const hasTechs = mission.reqTechs.every(t => player.unlockedTechs.includes(t));
  const hasPrevMissions = !mission.reqMissions || mission.reqMissions.every(m => player.completedMissions.includes(m));
  const notCompleted = !player.completedMissions.includes(mission.id);
  return hasResources && hasTechs && hasPrevMissions && notCompleted;
}

// Re-export for GameBoard
export { getFinalTechCost, getFinalMissionCost, getMaxDiscards };