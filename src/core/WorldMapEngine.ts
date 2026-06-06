import {
  canTravelTo,
  type DiscoveryContext,
  findLocation,
  getLocationState,
  reveal,
  revealConnections,
} from "../systems/discovery";
import { addKnowledge } from "../systems/journal";
import type { DialogueEffect, Location, LocationContent, Region } from "../types";
import { t } from "../utils";
import type { GameState } from "./GameState";

/**
 * Orquestração de navegação no grafo de descoberta (FASE 16). Compõe os
 * sistemas puros (`discovery`, `journal`) sobre o `GameState`, sem tocar em
 * I/O. A camada de jogo (game loop) usa estas funções para viajar entre
 * locais e aplicar os efeitos de diálogo; o combate/diálogo em si é resolvido
 * pela UI/CombatEngine.
 */

/** Constrói o contexto de descoberta (gates) a partir do estado atual. */
export function discoveryContextFromState(state: GameState): DiscoveryContext {
  return {
    knowledge: state.knowledge,
    level: state.player.level,
    hasItem: (itemId) => state.inventory.items.some((slot) => slot.item.id === itemId),
  };
}

/** Indica se o conteúdo de um local "fecha" o local ao ser resolvido. */
export function isCompletable(content: LocationContent): boolean {
  return content.kind === "combat" || content.kind === "boss" || content.kind === "lore";
}

/** Resultado de viajar a um local. */
export interface TravelResult {
  /** Estado atualizado (local atual + cadeia de revelação aplicada). */
  state: GameState;
  /** Local de destino. */
  location: Location;
  /** Conteúdo a ser resolvido pelo orquestrador. */
  content: LocationContent;
  /** Destino já estava concluído (revisita). */
  alreadyCompleted: boolean;
}

/**
 * Viaja para um local alcançável: valida o destino (revelado e disponível),
 * move o local atual e revela os vizinhos do destino (descoberta em cadeia).
 * Não resolve o conteúdo — apenas o devolve para o orquestrador.
 */
export function travelTo(region: Region, state: GameState, destinationId: string): TravelResult {
  const location = findLocation(region, destinationId);
  if (!location) {
    throw new Error(t("error.world.unknownLocation", { location: destinationId }));
  }
  const context = discoveryContextFromState(state);
  const displayState = getLocationState(location, state.locationStates, context);
  if (!canTravelTo(displayState)) {
    throw new Error(t("error.world.unreachable", { location: destinationId }));
  }
  const locationStates = revealConnections(region, state.locationStates, destinationId);
  return {
    state: { ...state, currentLocationId: destinationId, locationStates },
    location,
    content: location.content,
    alreadyCompleted: displayState === "completed",
  };
}

/**
 * Efeito de uma escolha de diálogo aplicado ao estado. Os efeitos puros
 * (revelar local, conceder conhecimento) já vêm aplicados em `state`; as ações
 * que exigem IO (loja/combate) e a missão iniciada são devolvidas para o
 * orquestrador resolver.
 */
export interface EffectOutcome {
  state: GameState;
  /** Id de loja a abrir (se a opção abriu uma loja). */
  openShop?: string;
  /** Id de inimigo para iniciar combate (se a opção iniciou um). */
  startCombat?: string;
  /** Id de missão iniciada (resolvida pelo orquestrador no conteúdo). */
  startedQuest?: string;
}

/** Aplica os efeitos puros de uma opção de diálogo e devolve as ações pendentes. */
export function applyDialogueEffect(
  state: GameState,
  effect: DialogueEffect | undefined,
): EffectOutcome {
  if (!effect) {
    return { state };
  }
  let next = state;
  if (effect.grantKnowledge) {
    next = { ...next, knowledge: addKnowledge(next.knowledge, effect.grantKnowledge) };
  }
  if (effect.revealLocation) {
    next = { ...next, locationStates: reveal(next.locationStates, effect.revealLocation) };
  }
  return {
    state: next,
    openShop: effect.openShop,
    startCombat: effect.startCombat,
    startedQuest: effect.startQuest,
  };
}
