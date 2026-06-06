import type { Enemy } from "../../types";

/**
 * Rei Goblin — chefe dos Campos Iniciais (CONTENT_BIBLE, nível 5).
 *
 * Modelado como um Enemy reforçado. Mecânicas exclusivas (Golpe Brutal,
 * Grito de Guerra) e loot garantido serão acopladas nas fases de loot e
 * polimento.
 */
export const goblinKing: Enemy = {
  id: "goblin_king",
  name: "name.goblin_king",
  level: 5,
  hp: 120,
  attack: 14,
  defense: 6,
  experienceReward: 200,
  lootTableId: "goblin_king",
};
