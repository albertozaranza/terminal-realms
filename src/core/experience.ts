import type { Player } from "../types";
import { MAX_LEVEL } from "./config";

/** Base e expoente da curva de XP (exponencial leve). */
const XP_BASE = 100;
const XP_EXPONENT = 1.5;

/** Ganhos de atributo aplicados a cada nível ganho. */
export const LEVEL_UP_GAINS = {
  maxHp: 10,
  maxMana: 5,
  strength: 1,
  dexterity: 1,
  intelligence: 1,
  defense: 1,
} as const;

/**
 * XP necessário para avançar de `level` para `level + 1`.
 * Retorna Infinity no nível máximo (não há mais evolução).
 */
export function xpToNextLevel(level: number): number {
  if (!Number.isInteger(level) || level < 1) {
    throw new Error(`xpToNextLevel: nível inválido (${level}).`);
  }
  if (level >= MAX_LEVEL) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.floor(XP_BASE * level ** XP_EXPONENT);
}

/** Resultado da concessão de experiência. */
export interface ExperienceResult {
  player: Player;
  leveledUp: boolean;
  levelsGained: number;
}

/**
 * Concede experiência a um jogador, processando múltiplos level ups.
 * Retorna um novo Player (função pura, não muta o original).
 * A cada nível: atributos aumentam e hp/mana são restaurados ao máximo.
 */
export function grantExperience(player: Player, amount: number): ExperienceResult {
  if (amount < 0) {
    throw new Error(`grantExperience: a quantidade de XP não pode ser negativa (${amount}).`);
  }

  const updated: Player = { ...player, experience: player.experience + amount };
  let levelsGained = 0;

  while (updated.level < MAX_LEVEL && updated.experience >= xpToNextLevel(updated.level)) {
    updated.experience -= xpToNextLevel(updated.level);
    updated.level += 1;
    levelsGained += 1;

    updated.maxHp += LEVEL_UP_GAINS.maxHp;
    updated.maxMana += LEVEL_UP_GAINS.maxMana;
    updated.strength += LEVEL_UP_GAINS.strength;
    updated.dexterity += LEVEL_UP_GAINS.dexterity;
    updated.intelligence += LEVEL_UP_GAINS.intelligence;
    updated.defense += LEVEL_UP_GAINS.defense;

    updated.hp = updated.maxHp;
    updated.mana = updated.maxMana;
  }

  return {
    player: updated,
    leveledUp: levelsGained > 0,
    levelsGained,
  };
}
