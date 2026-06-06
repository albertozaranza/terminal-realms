import type { Entity } from "./Entity";

/**
 * Inimigo enfrentado em combate. Definido de forma data-driven em content/.
 */
export interface Enemy extends Entity {
  level: number;

  hp: number;

  attack: number;

  defense: number;

  experienceReward: number;

  lootTableId: string;
}
