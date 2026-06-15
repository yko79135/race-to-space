// ============================================================
// TECHNOLOGY EFFECTS ENGINE
// Centralized cost calculation and permanent-bonus application
// ============================================================

import { technologies } from './gameData';

// ── Cost Calculation ──────────────────────────────────────────────────────────
/**
 * Returns the final cost for a technology after applying the player's bonuses.
 * Uses this everywhere: display, affordability check, and deduction.
 */
export function getFinalTechCost(player, tech) {
  let science = tech.scienceCost;
  let money = tech.moneyCost;
  let consensus = tech.consensusCost;

  const owned = player.unlockedTechs || [];

  for (const id of owned) {
    const t = technologies.find(x => x.id === id);
    if (!t || !t.permanentEffects) continue;
    for (const fx of t.permanentEffects) {
      switch (fx.type) {
        // Controlled Fire: next tech after fire costs 1 less Money
        // (applies when player has exactly [fire] unlocked — i.e. length === 1)
        case 'first_tech_discount': {
          if (id === 'fire' && player.unlockedTechs.length === 1 && player.unlockedTechs[0] === 'fire') {
            if (fx.resource === 'money') money -= fx.amount;
            if (fx.resource === 'science') science -= fx.amount;
            if (fx.resource === 'consensus') consensus -= fx.amount;
          }
          break;
        }
        // Basic Tools: stages 1-2 cost 1 less Money
        case 'technology_discount_stage': {
          if (fx.stages.includes(tech.stage)) {
            if (fx.resource === 'money') money -= fx.amount;
            if (fx.resource === 'science') science -= fx.amount;
            if (fx.resource === 'consensus') consensus -= fx.amount;
          }
          break;
        }
        // Metalworking: specific techs cost less Money
        case 'technology_discount_ids': {
          if (fx.technologyIds.includes(tech.id)) {
            if (fx.resource === 'money') money -= fx.amount;
            if (fx.resource === 'science') science -= fx.amount;
            if (fx.resource === 'consensus') consensus -= fx.amount;
          }
          break;
        }
        // Astronomy: guidance + satellites cost less Science
        // Airplanes: rocket_engines costs less Science
        // These both use technology_discount_ids
        default:
          break;
      }
    }
  }

  return {
    science: Math.max(0, science),
    money: Math.max(0, money),
    consensus: Math.max(0, consensus),
  };
}

// ── Mission Cost Calculation ──────────────────────────────────────────────────
/**
 * Returns the final cost for a mission after applying the player's bonuses.
 */
export function getFinalMissionCost(player, mission) {
  let science = mission.cost.science;
  let money = mission.cost.money;
  let consensus = mission.cost.consensus;

  const owned = player.unlockedTechs || [];

  for (const id of owned) {
    const t = technologies.find(x => x.id === id);
    if (!t || !t.permanentEffects) continue;
    for (const fx of t.permanentEffects) {
      if (fx.type === 'mission_discount') {
        if (fx.missionIds.includes(mission.id)) {
          if (fx.resource === 'science') science -= fx.amount;
          if (fx.resource === 'money') money -= fx.amount;
          if (fx.resource === 'consensus') consensus -= fx.amount;
        }
      }
    }
  }

  return {
    science: Math.max(0, science),
    money: Math.max(0, money),
    consensus: Math.max(0, consensus),
  };
}

// ── Affordability Checks ──────────────────────────────────────────────────────
export function canAffordTech(player, tech) {
  const cost = getFinalTechCost(player, tech);
  const r = player.resources;
  return r.science >= cost.science && r.money >= cost.money && r.consensus >= cost.consensus;
}

export function canAffordMission(player, mission) {
  const cost = getFinalMissionCost(player, mission);
  const r = player.resources;
  return r.science >= cost.science && r.money >= cost.money && r.consensus >= cost.consensus;
}

// ── Start-of-Turn Bonuses ─────────────────────────────────────────────────────
/**
 * Applies all start-of-turn resource bonuses from the player's owned technologies.
 * Returns a resource delta { science, money, consensus }.
 * NOTE: Electricity (choose science or money) is handled in UI; default choice is money here.
 * The caller (GameBoard) should override the electricity choice when needed.
 */
export function getStartOfTurnBonus(player) {
  const bonus = { science: 0, money: 0, consensus: 0 };
  const owned = player.unlockedTechs || [];

  for (const id of owned) {
    const t = technologies.find(x => x.id === id);
    if (!t || !t.permanentEffects) continue;
    for (const fx of t.permanentEffects) {
      if (fx.type === 'start_turn_resource') {
        bonus[fx.resource] = (bonus[fx.resource] || 0) + fx.amount;
      }
    }
  }
  return bonus;
}

/**
 * Returns whether the player has a start-of-turn choice (Electricity).
 */
export function hasElectricityBonus(player) {
  return (player.unlockedTechs || []).includes('electricity');
}

// ── Max Discards Per Turn ─────────────────────────────────────────────────────
/**
 * Returns the player's max discards per turn (Writing adds 1).
 */
export function getMaxDiscards(player, baseMax) {
  const owned = player.unlockedTechs || [];
  let max = baseMax;
  for (const id of owned) {
    const t = technologies.find(x => x.id === id);
    if (!t || !t.permanentEffects) continue;
    for (const fx of t.permanentEffects) {
      if (fx.type === 'extra_discard_per_turn') {
        max += fx.amount;
      }
    }
  }
  return max;
}

// ── Science Card Draw Bonus (Scientific Experiments) ─────────────────────────
/**
 * Returns true if the player should draw 1 card after playing their first
 * Science resource card this turn (Scientific Experiments).
 * The caller must track whether it has triggered this turn.
 */
export function hasScienceCardDrawBonus(player) {
  return (player.unlockedTechs || []).includes('experiments');
}

// ── Event Protection (Chemistry) ─────────────────────────────────────────────
/**
 * Reduces negative event resource losses by 1 (once per trigger).
 * Returns the adjusted delta.
 */
export function applyEventProtection(player, eventDelta, hasTriggeredThisTurn) {
  if (hasTriggeredThisTurn) return eventDelta;
  const owned = player.unlockedTechs || [];
  const hasChemistry = owned.includes('chemistry');
  if (!hasChemistry) return eventDelta;

  const adjusted = { ...eventDelta };
  // Reduce the first negative resource loss by 1
  for (const key of ['science', 'money', 'consensus']) {
    if (adjusted[key] < 0) {
      adjusted[key] = Math.min(0, adjusted[key] + 1);
      break; // only once
    }
  }
  return adjusted;
}

// ── Mission Completion Bonuses ────────────────────────────────────────────────
/**
 * Returns resource delta to apply when a player completes a mission.
 * Radio: completing a mission grants own player +2 Consensus.
 */
export function getMissionCompletionBonus(player) {
  const owned = player.unlockedTechs || [];
  const bonus = { science: 0, money: 0, consensus: 0 };
  if (owned.includes('radio')) bonus.consensus += 2;
  return bonus;
}

/**
 * Returns resource delta to apply to OTHER players when ANY player completes a mission.
 * Life Support: other players who own it gain +1 Consensus.
 */
export function getOtherPlayerMissionBonus(otherPlayer) {
  const owned = otherPlayer.unlockedTechs || [];
  const bonus = { science: 0, money: 0, consensus: 0 };
  if (owned.includes('lifesupport')) bonus.consensus += 1;
  return bonus;
}