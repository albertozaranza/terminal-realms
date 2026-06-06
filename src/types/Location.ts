import type { Entity } from "./Entity";

/** Estado de descoberta de um local no mapa da região. */
export type LocationState = "undiscovered" | "discovered" | "available" | "completed" | "locked";

/** Categoria visual/semântica de um ponto de interesse. */
export type LocationType =
  | "village"
  | "road"
  | "woods"
  | "ruins"
  | "crypt"
  | "npc"
  | "shop"
  | "boss"
  | "lore";

/** Posição do local na grade do mapa da região (coordenadas data-driven). */
export interface MapCoord {
  col: number;
  row: number;
}

/** Pré-requisitos para um local/aresta/opção ficar disponível (gate). */
export interface DiscoveryRequirement {
  /** Ids de conhecimento necessários. */
  knowledge?: readonly string[];
  /** Nível mínimo do jogador. */
  level?: number;
  /** Id de item exigido no inventário. */
  itemId?: string;
}

/**
 * O que acontece ao interagir com um local. União discriminada para que a
 * engine resolva o conteúdo sem ifs gigantes.
 */
export type LocationContent =
  | { kind: "combat"; enemyId: string }
  | { kind: "boss"; bossId: string }
  | { kind: "npc"; npcId: string }
  | { kind: "shop"; shopId: string }
  | { kind: "lore"; knowledgeId: string }
  | { kind: "empty" };

/**
 * Ponto de interesse (POI) — nó do grafo de uma região. Locais são
 * data-driven (content/); a engine apenas percorre o grafo.
 */
export interface Location extends Entity {
  /** Ícone (emoji) exibido no mapa. */
  icon: string;
  type: LocationType;
  /** Posição no mapa da região. */
  coord: MapCoord;
  /** Ids de locais vizinhos (arestas do grafo). */
  connections: readonly string[];
  /** Requisitos para tornar o local disponível (gate por conhecimento/nível/item). */
  requirements?: DiscoveryRequirement;
  /** Conteúdo acionado ao visitar. */
  content: LocationContent;
  /** Chave i18n de descrição (opcional). */
  description?: string;
}
