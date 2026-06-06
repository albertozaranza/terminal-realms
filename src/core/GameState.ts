import type { Inventory, Player, Quest, Region, Statistics } from "../types";

/**
 * Estado global único da aplicação. Toda mudança de estado deve passar
 * pela engine — a UI nunca altera o GameState diretamente.
 */
export interface GameState {
  player: Player;
  currentRegion: Region;
  inventory: Inventory;
  activeQuest?: Quest;
  statistics: Statistics;
}

/** Cria estatísticas zeradas. */
export function createStatistics(): Statistics {
  return {
    enemiesDefeated: 0,
    bossesDefeated: 0,
    totalGoldEarned: 0,
    totalExperienceEarned: 0,
    deaths: 0,
  };
}

/** Cria um inventário vazio. */
export function createInventory(): Inventory {
  return {
    items: [],
    gold: 0,
  };
}

/**
 * Monta um estado inicial válido a partir do jogador e da região atual.
 * O jogador e a região são fornecidos pela criação de personagem (T009)
 * e pelo conteúdo de regiões, mantendo a engine desacoplada das classes.
 */
export function createInitialGameState(player: Player, currentRegion: Region): GameState {
  return {
    player,
    currentRegion,
    inventory: createInventory(),
    statistics: createStatistics(),
  };
}
