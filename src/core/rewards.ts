import { addGold, addItem } from "../systems/inventory";
import type { Item } from "../types";
import { grantExperience } from "./experience";
import type { GameState } from "./GameState";

/** Recompensas já resolvidas de uma vitória (XP, itens e ouro). */
export interface VictoryRewards {
  experience: number;
  loot: readonly Item[];
  gold: number;
}

/** Resultado da aplicação das recompensas ao estado. */
export interface VictoryOutcome {
  state: GameState;
  leveledUp: boolean;
  levelsGained: number;
}

/**
 * Aplica as recompensas de uma vitória ao estado do jogo: concede XP
 * (com level up), adiciona o loot e o ouro ao inventário e atualiza as
 * estatísticas. Função pura — retorna um novo GameState.
 *
 * Recebe recompensas já resolvidas (itens, não ids) para manter a core
 * desacoplada da camada de conteúdo.
 */
export function applyVictoryRewards(state: GameState, rewards: VictoryRewards): VictoryOutcome {
  const xp = grantExperience(state.player, rewards.experience);

  let inventory = state.inventory;
  for (const item of rewards.loot) {
    inventory = addItem(inventory, item);
  }
  inventory = addGold(inventory, rewards.gold);

  const statistics = {
    ...state.statistics,
    enemiesDefeated: state.statistics.enemiesDefeated + 1,
    totalGoldEarned: state.statistics.totalGoldEarned + rewards.gold,
    totalExperienceEarned: state.statistics.totalExperienceEarned + rewards.experience,
  };

  return {
    state: { ...state, player: xp.player, inventory, statistics },
    leveledUp: xp.leveledUp,
    levelsGained: xp.levelsGained,
  };
}
