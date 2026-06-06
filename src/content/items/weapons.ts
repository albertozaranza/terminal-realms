import type { Equipment } from "../../types";

/** Espada Enferrujada — arma inicial do Guerreiro (CONTENT_BIBLE: ATK +2). */
export const espadaEnferrujada: Equipment = {
  id: "espada_enferrujada",
  name: "Espada Enferrujada",
  description: "Uma espada velha e desgastada. Melhor que punhos nus.",
  rarity: "common",
  value: 15,
  slot: "weapon",
  modifiers: [{ stat: "strength", value: 2 }],
};

/** Arco Simples — arma inicial do Arqueiro (CONTENT_BIBLE: ATK +2). */
export const arcoSimples: Equipment = {
  id: "arco_simples",
  name: "Arco Simples",
  description: "Um arco de madeira simples, mas confiável.",
  rarity: "common",
  value: 15,
  slot: "weapon",
  modifiers: [{ stat: "dexterity", value: 2 }],
};

/** Cajado de Carvalho — arma inicial do Mago (CONTENT_BIBLE: INT +2). */
export const cajadoCarvalho: Equipment = {
  id: "cajado_carvalho",
  name: "Cajado de Carvalho",
  description: "Um cajado de carvalho que canaliza energia arcana.",
  rarity: "common",
  value: 15,
  slot: "weapon",
  modifiers: [{ stat: "intelligence", value: 2 }],
};
