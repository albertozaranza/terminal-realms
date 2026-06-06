import type { DiscoveryRequirement, Location, LocationState, Region } from "../types";

/**
 * Sistema de descoberta (puro). Opera sobre o grafo de locais de uma região
 * e o mapa de estados persistidos (`Record<id, LocationState>`).
 *
 * Modelo de estados:
 * - **persistido**: `undiscovered` (ausente) | `discovered` (revelado) |
 *   `completed` (concluído).
 * - **derivado** (exibição): para um local revelado, `available` quando os
 *   requisitos são atendidos ou `locked` quando não — calculado a cada leitura
 *   para refletir mudanças de conhecimento/nível/itens sem estado obsoleto.
 *
 * Funções imutáveis: retornam novos objetos, nunca mutam os argumentos.
 */

export type LocationStates = Record<string, LocationState>;

/** Contexto do jogador usado para avaliar requisitos (gates). */
export interface DiscoveryContext {
  knowledge: readonly string[];
  level: number;
  hasItem: (itemId: string) => boolean;
}

/** Encontra um local da região pelo id (undefined se a região não tem grafo). */
export function findLocation(region: Region, id: string): Location | undefined {
  return region.locations?.find((location) => location.id === id);
}

/** Indica se um requisito (gate) é atendido pelo contexto do jogador. */
export function meetsRequirement(
  requirement: DiscoveryRequirement | undefined,
  context: DiscoveryContext,
): boolean {
  if (!requirement) {
    return true;
  }
  if (requirement.level !== undefined && context.level < requirement.level) {
    return false;
  }
  if (requirement.itemId !== undefined && !context.hasItem(requirement.itemId)) {
    return false;
  }
  if (
    requirement.knowledge !== undefined &&
    !requirement.knowledge.every((id) => context.knowledge.includes(id))
  ) {
    return false;
  }
  return true;
}

/**
 * Estado de exibição de um local: deriva `available`/`locked` para locais
 * revelados a partir dos requisitos; `undiscovered`/`completed` são diretos.
 */
export function getLocationState(
  location: Location,
  states: LocationStates,
  context: DiscoveryContext,
): LocationState {
  const stored = states[location.id] ?? "undiscovered";
  if (stored === "undiscovered" || stored === "completed") {
    return stored;
  }
  // stored === "discovered" | "available" | "locked" → revelado.
  return meetsRequirement(location.requirements, context) ? "available" : "locked";
}

/** Indica se um local já foi revelado (não está mais oculto). */
export function isRevealed(states: LocationStates, id: string): boolean {
  const stored = states[id];
  return stored !== undefined && stored !== "undiscovered";
}

/** Marca um local como revelado (`discovered`), se ainda estava oculto. */
export function reveal(states: LocationStates, id: string): LocationStates {
  if (isRevealed(states, id)) {
    return states;
  }
  return { ...states, [id]: "discovered" };
}

/**
 * Descoberta em cadeia: revela todos os vizinhos diretos de um local. É o que
 * faz uma região "crescer" conforme o jogador a percorre.
 */
export function revealConnections(
  region: Region,
  states: LocationStates,
  locationId: string,
): LocationStates {
  const location = findLocation(region, locationId);
  if (!location) {
    return states;
  }
  let next = states;
  for (const connectionId of location.connections) {
    next = reveal(next, connectionId);
  }
  return next;
}

/** Marca um local como concluído. */
export function markCompleted(states: LocationStates, id: string): LocationStates {
  return { ...states, [id]: "completed" };
}

/** Indica se é possível viajar para um local no estado de exibição informado. */
export function canTravelTo(state: LocationState): boolean {
  return state === "available" || state === "completed";
}

/** Destino de viagem a partir do local atual, com seu estado de exibição. */
export interface Destination {
  location: Location;
  state: LocationState;
}

/**
 * Destinos alcançáveis a partir do local atual: vizinhos **revelados** (não
 * ocultos), cada um com seu estado de exibição. Locais bloqueados (`locked`)
 * são incluídos para a UI exibi-los esmaecidos; o chamador filtra os
 * navegáveis via {@link canTravelTo}.
 */
export function getDestinations(
  region: Region,
  currentId: string,
  states: LocationStates,
  context: DiscoveryContext,
): Destination[] {
  const current = findLocation(region, currentId);
  if (!current) {
    return [];
  }
  const destinations: Destination[] = [];
  for (const id of current.connections) {
    const location = findLocation(region, id);
    if (!location) {
      continue;
    }
    const state = getLocationState(location, states, context);
    if (state !== "undiscovered") {
      destinations.push({ location, state });
    }
  }
  return destinations;
}
