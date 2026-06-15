import { allTechCards, infrastructureCards, policyCards, eventCards, missionCards, aiCountryNames } from './cardData';

// ============ INITIAL STATE ============
export function createInitialState(playerName, difficulty) {
  const aiPlayers = aiCountryNames.map((c, i) => ({
    id: `ai_${i}`,
    name_en: c.name_en,
    name_ko: c.name_ko,
    isAI: true,
    resources: { science: 2, money: 3, consensus: 2 },
    unlockedTechs: [],
    builtInfra: [],
    activePolicies: [],
    completedMissions: [],
    currentEra: 1,
  }));

  // Build initial deck for player
  const starterHand = buildStarterHand();

  return {
    playerCountry: {
      id: 'player',
      name: playerName,
      isAI: false,
      resources: { science: 2, money: 3, consensus: 2 },
      unlockedTechs: [],
      builtInfra: [],
      activePolicies: [],
      completedMissions: [],
      hand: starterHand,
      currentEra: 1,
    },
    aiPlayers,
    difficulty, // 'easy', 'normal', 'hard'
    turn: 1,
    phase: 'resource', // resource -> draw -> action -> event -> ai -> end
    actionsRemaining: 2,
    maxActions: 2,
    gameOver: false,
    winner: null,
    currentEvent: null,
    notification: null,
    educationalPopup: null,
    showMissionComplete: null,
  };
}

function buildStarterHand() {
  // Give player a mix of early affordable cards
  const era1Techs = allTechCards.filter(c => c.era === 1 && (!c.prerequisites || c.prerequisites.length === 0));
  const earlyInfra = infrastructureCards.filter(c => c.era <= 2);
  const earlyPolicies = policyCards.filter(c => c.era <= 2);
  
  const hand = [];
  // 3 era 1 discoveries
  const shuffled = [...era1Techs].sort(() => Math.random() - 0.5);
  hand.push(...shuffled.slice(0, 3));
  // 1 infrastructure
  hand.push(earlyInfra[Math.floor(Math.random() * earlyInfra.length)]);
  // 1 policy
  hand.push(earlyPolicies[Math.floor(Math.random() * earlyPolicies.length)]);
  
  return hand;
}

// ============ DRAW CARDS ============
export function drawCards(state, count = 2) {
  const player = state.playerCountry;
  const currentEra = getCurrentEra(player);
  
  // Available cards: techs up to current era +1, infra, policies
  const availableTechs = allTechCards.filter(c => {
    if (c.era > currentEra + 1) return false;
    if (player.unlockedTechs.includes(c.id)) return false;
    if (player.hand.some(h => h.id === c.id)) return false;
    return true;
  });
  
  const availableInfra = infrastructureCards.filter(c => {
    if (!canSeeCard(player, c)) return false;
    if (player.builtInfra.includes(c.id)) return false;
    if (player.hand.some(h => h.id === c.id)) return false;
    return true;
  });
  
  const availablePolicies = policyCards.filter(c => {
    if (player.hand.some(h => h.id === c.id)) return false;
    return true;
  });
  
  const pool = [...availableTechs, ...availableInfra, ...availablePolicies];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const drawn = shuffled.slice(0, count);
  
  return {
    ...state,
    playerCountry: {
      ...player,
      hand: [...player.hand, ...drawn],
    },
  };
}

function canSeeCard(player, card) {
  if (!card.prerequisites) return true;
  // Show if at least some prereqs met or era is reachable
  return true;
}

// ============ RESOURCE GENERATION ============
export function generateResources(state) {
  const player = { ...state.playerCountry };
  const bonus = { science: 1, money: 1, consensus: 1 }; // base per-turn gain
  
  // Add infrastructure bonuses
  player.builtInfra.forEach(infraId => {
    const infra = infrastructureCards.find(c => c.id === infraId);
    if (infra?.perTurnBonus) {
      bonus.science += infra.perTurnBonus.science;
      bonus.money += infra.perTurnBonus.money;
      bonus.consensus += infra.perTurnBonus.consensus;
    }
  });
  
  player.resources = {
    science: player.resources.science + bonus.science,
    money: player.resources.money + bonus.money,
    consensus: player.resources.consensus + bonus.consensus,
  };
  
  return { ...state, playerCountry: player, resourceGain: bonus };
}

// ============ PLAY CARD ============
export function canPlayCard(state, card) {
  const player = state.playerCountry;
  
  if (state.actionsRemaining <= 0) return { canPlay: false, reason: 'noActionsLeft' };
  
  // Check cost
  const cost = card.cost;
  if (cost) {
    if (player.resources.science < cost.science) return { canPlay: false, reason: 'notEnoughResources' };
    if (player.resources.money < cost.money) return { canPlay: false, reason: 'notEnoughResources' };
    if (player.resources.consensus < cost.consensus) return { canPlay: false, reason: 'notEnoughResources' };
  }
  
  // Check prerequisites
  if (card.prerequisites) {
    for (const prereq of card.prerequisites) {
      if (!player.unlockedTechs.includes(prereq)) {
        return { canPlay: false, reason: 'prerequisitesNotMet' };
      }
    }
  }
  
  // Check required infrastructure for missions
  if (card.requiredInfra) {
    for (const infra of card.requiredInfra) {
      if (!player.builtInfra.includes(infra)) {
        return { canPlay: false, reason: 'prerequisitesNotMet' };
      }
    }
  }
  
  // Check mission order
  if (card.type === 'mission') {
    const prevMissions = missionCards.filter(m => m.missionOrder < card.missionOrder);
    for (const pm of prevMissions) {
      if (!player.completedMissions.includes(pm.id)) {
        return { canPlay: false, reason: 'prerequisitesNotMet' };
      }
    }
  }
  
  // Check if already unlocked/built
  if ((card.type === 'discovery' || card.type === 'technology') && player.unlockedTechs.includes(card.id)) {
    return { canPlay: false, reason: 'alreadyUnlocked' };
  }
  if (card.type === 'infrastructure' && player.builtInfra.includes(card.id)) {
    return { canPlay: false, reason: 'alreadyBuilt' };
  }
  
  return { canPlay: true };
}

export function playCard(state, card) {
  let player = { ...state.playerCountry, resources: { ...state.playerCountry.resources } };
  let educationalPopup = null;
  let showMissionComplete = null;
  
  // Deduct cost
  if (card.cost) {
    player.resources.science -= card.cost.science;
    player.resources.money -= card.cost.money;
    player.resources.consensus -= card.cost.consensus;
  }
  
  // Apply effect based on type
  if (card.type === 'discovery' || card.type === 'technology') {
    player.unlockedTechs = [...player.unlockedTechs, card.id];
    if (card.effect) {
      player.resources.science += card.effect.science || 0;
      player.resources.money += card.effect.money || 0;
      player.resources.consensus += card.effect.consensus || 0;
    }
    player.currentEra = getCurrentEra(player);
    if (card.educational_en) {
      educationalPopup = card;
    }
  } else if (card.type === 'infrastructure') {
    player.builtInfra = [...player.builtInfra, card.id];
  } else if (card.type === 'policy') {
    player.activePolicies = [...player.activePolicies, card.id];
    if (card.effect) {
      player.resources.science += card.effect.science || 0;
      player.resources.money += card.effect.money || 0;
      player.resources.consensus += card.effect.consensus || 0;
    }
  } else if (card.type === 'mission') {
    player.completedMissions = [...player.completedMissions, card.id];
    showMissionComplete = card;
    if (card.educational_en) {
      educationalPopup = card;
    }
  }
  
  // Remove card from hand
  player.hand = player.hand.filter(c => c.id !== card.id);
  
  // Ensure resources don't go below 0
  player.resources.science = Math.max(0, player.resources.science);
  player.resources.money = Math.max(0, player.resources.money);
  player.resources.consensus = Math.max(0, player.resources.consensus);
  
  // Check victory
  let gameOver = false;
  let winner = null;
  if (card.id === 'crewed_spaceflight') {
    gameOver = true;
    winner = 'player';
  }
  
  return {
    ...state,
    playerCountry: player,
    actionsRemaining: state.actionsRemaining - 1,
    gameOver,
    winner,
    educationalPopup,
    showMissionComplete,
  };
}

// ============ EVENTS ============
export function triggerEvent(state) {
  if (Math.random() < 0.4) return { ...state, currentEvent: null }; // 40% no event
  
  const event = eventCards[Math.floor(Math.random() * eventCards.length)];
  const player = { ...state.playerCountry, resources: { ...state.playerCountry.resources } };
  
  player.resources.science = Math.max(0, player.resources.science + event.effect.science);
  player.resources.money = Math.max(0, player.resources.money + event.effect.money);
  player.resources.consensus = Math.max(0, player.resources.consensus + event.effect.consensus);
  
  return { ...state, playerCountry: player, currentEvent: event };
}

// ============ AI TURN ============
export function processAITurns(state) {
  const diffMultiplier = { easy: 0.7, normal: 1.0, hard: 1.4 };
  const mult = diffMultiplier[state.difficulty] || 1.0;
  
  const updatedAI = state.aiPlayers.map(ai => {
    const updated = { ...ai, resources: { ...ai.resources } };
    
    // Resource generation
    const baseGain = { science: 1, money: 1, consensus: 1 };
    updated.builtInfra.forEach(infraId => {
      const infra = infrastructureCards.find(c => c.id === infraId);
      if (infra?.perTurnBonus) {
        baseGain.science += infra.perTurnBonus.science;
        baseGain.money += infra.perTurnBonus.money;
        baseGain.consensus += infra.perTurnBonus.consensus;
      }
    });
    
    updated.resources.science += Math.round(baseGain.science * mult);
    updated.resources.money += Math.round(baseGain.money * mult);
    updated.resources.consensus += Math.round(baseGain.consensus * mult);
    
    // AI actions (2 per turn)
    for (let action = 0; action < 2; action++) {
      // Try to complete missions first
      const availableMissions = missionCards
        .filter(m => !updated.completedMissions.includes(m.id))
        .filter(m => {
          if (m.prerequisites && m.prerequisites.some(p => !updated.unlockedTechs.includes(p))) return false;
          if (m.requiredInfra && m.requiredInfra.some(i => !updated.builtInfra.includes(i))) return false;
          const prevMissions = missionCards.filter(pm => pm.missionOrder < m.missionOrder);
          if (prevMissions.some(pm => !updated.completedMissions.includes(pm.id))) return false;
          return canAfford(updated.resources, m.cost);
        })
        .sort((a, b) => b.missionOrder - a.missionOrder);
      
      if (availableMissions.length > 0) {
        const m = availableMissions[0];
        deductCost(updated.resources, m.cost);
        updated.completedMissions = [...updated.completedMissions, m.id];
        continue;
      }
      
      // Try to research technologies (prioritize higher era)
      const availableTechs = allTechCards
        .filter(t => !updated.unlockedTechs.includes(t.id))
        .filter(t => {
          if (t.prerequisites && t.prerequisites.some(p => !updated.unlockedTechs.includes(p))) return false;
          return canAfford(updated.resources, t.cost);
        })
        .sort((a, b) => b.era - a.era);
      
      if (availableTechs.length > 0) {
        // Smart: pick highest era tech (hard), random among top 3 (normal), random (easy)
        let pick;
        if (state.difficulty === 'hard') {
          pick = availableTechs[0];
        } else if (state.difficulty === 'normal') {
          const top = availableTechs.slice(0, 3);
          pick = top[Math.floor(Math.random() * top.length)];
        } else {
          pick = availableTechs[Math.floor(Math.random() * availableTechs.length)];
        }
        deductCost(updated.resources, pick.cost);
        updated.unlockedTechs = [...updated.unlockedTechs, pick.id];
        if (pick.effect) {
          updated.resources.science += pick.effect.science || 0;
          updated.resources.money += pick.effect.money || 0;
          updated.resources.consensus += pick.effect.consensus || 0;
        }
        continue;
      }
      
      // Try to build infrastructure
      const availableInfra = infrastructureCards
        .filter(inf => !updated.builtInfra.includes(inf.id))
        .filter(inf => {
          if (inf.prerequisites && inf.prerequisites.some(p => !updated.unlockedTechs.includes(p))) return false;
          return canAfford(updated.resources, inf.cost);
        });
      
      if (availableInfra.length > 0) {
        const inf = availableInfra[Math.floor(Math.random() * availableInfra.length)];
        deductCost(updated.resources, inf.cost);
        updated.builtInfra = [...updated.builtInfra, inf.id];
      }
    }
    
    updated.currentEra = getCurrentEra(updated);
    
    // Ensure resources don't go below 0
    updated.resources.science = Math.max(0, updated.resources.science);
    updated.resources.money = Math.max(0, updated.resources.money);
    updated.resources.consensus = Math.max(0, updated.resources.consensus);
    
    return updated;
  });
  
  // Check if any AI won
  let gameOver = state.gameOver;
  let winner = state.winner;
  for (const ai of updatedAI) {
    if (ai.completedMissions.includes('crewed_spaceflight')) {
      gameOver = true;
      winner = ai.id;
      break;
    }
  }
  
  return { ...state, aiPlayers: updatedAI, gameOver, winner };
}

// ============ HELPERS ============
function canAfford(resources, cost) {
  if (!cost) return true;
  return resources.science >= cost.science && resources.money >= cost.money && resources.consensus >= cost.consensus;
}

function deductCost(resources, cost) {
  if (!cost) return;
  resources.science -= cost.science;
  resources.money -= cost.money;
  resources.consensus -= cost.consensus;
}

export function getCurrentEra(player) {
  const techs = player.unlockedTechs || [];
  if (techs.length === 0) return 1;
  
  const allTechs = allTechCards;
  let maxEra = 1;
  techs.forEach(tid => {
    const t = allTechs.find(c => c.id === tid);
    if (t && t.era > maxEra) maxEra = t.era;
  });
  return maxEra;
}

export function getEraProgress(player) {
  const era = getCurrentEra(player);
  const allInEra = allTechCards.filter(t => t.era === era);
  const unlockedInEra = allInEra.filter(t => player.unlockedTechs.includes(t.id));
  return { current: unlockedInEra.length, total: allInEra.length, era };
}