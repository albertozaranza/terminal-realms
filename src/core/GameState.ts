import type {
  Inventory,
  Loadout,
  LocationState,
  Player,
  Quest,
  Region,
  Statistics,
} from "../types";
import { getLanguage, type Language } from "../utils";

/** Estado de descoberta/relacionamento com um NPC (persistido no save). */
export interface NpcState {
  /** Já conversou com o NPC ao menos uma vez. */
  talkedTo: boolean;
}

/**
 * Estado global único da aplicação. Toda mudança de estado deve passar
 * pela engine — a UI nunca altera o GameState diretamente.
 */
export interface GameState {
  player: Player;
  currentRegion: Region;
  inventory: Inventory;
  /** Equipamentos vestidos (bônus aplicados em combate; persistido no save). */
  loadout: Loadout;
  activeQuest?: Quest;
  statistics: Statistics;
  /** Idioma escolhido pelo jogador (persistido no save). */
  language: Language;
  /** Local atual no grafo de descoberta (FASE 16); undefined em regiões lineares. */
  currentLocationId?: string;
  /** Estado de descoberta de cada local da região (por id). */
  locationStates: Record<string, LocationState>;
  /** Conhecimentos adquiridos (ids), base do diário e dos gates. */
  knowledge: string[];
  /** Estado de relacionamento com NPCs (por id). */
  npcStates: Record<string, NpcState>;
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
 * Estados iniciais de descoberta da região. Regiões com grafo (FASE 16)
 * começam com o local de entrada **revelado** (`discovered`) e os demais
 * ocultos. O estado de exibição (`available`/`locked`) é derivado pelo
 * sistema de descoberta a partir dos requisitos; aqui guardamos só o estado
 * persistido (`undiscovered` | `discovered` | `completed`).
 */
export function createInitialLocationStates(region: Region): Record<string, LocationState> {
  const states: Record<string, LocationState> = {};
  if (region.entryLocationId) {
    states[region.entryLocationId] = "discovered";
  }
  return states;
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
    loadout: {},
    statistics: createStatistics(),
    language: getLanguage(),
    currentLocationId: currentRegion.entryLocationId,
    locationStates: createInitialLocationStates(currentRegion),
    knowledge: [],
    npcStates: {},
  };
}
