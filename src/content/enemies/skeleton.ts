import type { Enemy } from "../../types";

/** Esqueleto — morto-vivo. Stats coerentes com a progressão inicial. */
export const skeleton: Enemy = {
  id: "skeleton",
  name: "Esqueleto",
  level: 3,
  hp: 35,
  attack: 7,
  defense: 3,
  experienceReward: 30,
  lootTableId: "skeleton",
};
