import type { Enemy } from "../../types";

/** Goblin — stats conforme CONTENT_BIBLE. */
export const goblin: Enemy = {
  id: "goblin",
  name: "Goblin",
  level: 1,
  hp: 25,
  attack: 5,
  defense: 2,
  experienceReward: 20,
  lootTableId: "goblin",
};
