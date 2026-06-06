import type { Region } from "../../types";

/** Campos Iniciais — primeira região do jogo (CONTENT_BIBLE). */
export const camposIniciais: Region = {
  id: "campos_iniciais",
  name: "Campos Iniciais",
  minLevel: 1,
  maxLevel: 5,
  enemyPool: ["goblin", "wolf", "skeleton", "orc"],
  bossId: "rei_goblin",
};
