import type { Entity } from "./Entity";

/**
 * Personagem controlado pelo jogador.
 *
 * O inventário NÃO vive aqui: o inventário canônico é `GameState.inventory`
 * (ver T040/T051). Manter o inventário fora do Player evita estado duplicado.
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
}
