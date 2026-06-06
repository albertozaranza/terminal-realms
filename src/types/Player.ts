import type { Entity } from "./Entity";
import type { Item } from "./Item";

/**
 * Personagem controlado pelo jogador.
 */
export interface Player extends Entity {
  level: number;
  experience: number;

  hp: number;
  maxHp: number;

  mana: number;
  maxMana: number;

  strength: number;
  dexterity: number;
  intelligence: number;

  defense: number;
  speed: number;

  classId: string;

  inventory: Item[];
}
