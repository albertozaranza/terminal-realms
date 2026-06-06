import type { Enemy } from "../../types";

/** Orc — humanoide robusto. Stats coerentes com a progressão inicial. */
export const orc: Enemy = {
  id: "orc",
  name: "name.orc",
  level: 4,
  hp: 50,
  attack: 10,
  defense: 4,
  experienceReward: 45,
  lootTableId: "orc",
};
