import type { Enemy } from "../../types";

/** Lobo — stats conforme CONTENT_BIBLE. */
export const wolf: Enemy = {
  id: "wolf",
  name: "Lobo",
  level: 2,
  hp: 30,
  attack: 6,
  defense: 2,
  experienceReward: 25,
  lootTableId: "wolf",
};
