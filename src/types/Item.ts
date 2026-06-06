import type { Entity } from "./Entity";

/** Raridades possíveis de um item (CONTENT_BIBLE). */
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

/** Slots de equipamento (CONTENT_BIBLE). */
export type EquipmentSlot = "weapon" | "helmet" | "chest" | "gloves" | "boots" | "ring" | "amulet";

/**
 * Item base do jogo. Equipamentos e consumíveis estendem este contrato
 * nas tarefas dos sistemas correspondentes.
 */
export interface Item extends Entity {
  description: string;
  rarity: Rarity;
  /** Valor em Gold. */
  value: number;
}
