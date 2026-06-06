import type { Region } from "../../types";

/** Campos Iniciais — primeira região do jogo (CONTENT_BIBLE). */
export const startingFields: Region = {
  id: "starting_fields",
  name: "Campos Iniciais",
  minLevel: 1,
  maxLevel: 5,
  enemyPool: ["goblin", "wolf", "skeleton", "orc"],
  bossId: "goblin_king",
};
