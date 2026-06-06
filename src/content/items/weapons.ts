import type { Equipment } from "../../types";

/** Espada Enferrujada — arma inicial do Guerreiro (CONTENT_BIBLE: ATK +2). */
export const rustySword: Equipment = {
  id: "rusty_sword",
  name: "name.rusty_sword",
  description: "desc.rusty_sword",
  rarity: "common",
  value: 15,
  slot: "weapon",
  modifiers: [{ stat: "strength", value: 2 }],
};

/** Arco Simples — arma inicial do Arqueiro (CONTENT_BIBLE: ATK +2). */
export const simpleBow: Equipment = {
  id: "simple_bow",
  name: "name.simple_bow",
  description: "desc.simple_bow",
  rarity: "common",
  value: 15,
  slot: "weapon",
  modifiers: [{ stat: "dexterity", value: 2 }],
};

/** Cajado de Carvalho — arma inicial do Mago (CONTENT_BIBLE: INT +2). */
export const oakStaff: Equipment = {
  id: "oak_staff",
  name: "name.oak_staff",
  description: "desc.oak_staff",
  rarity: "common",
  value: 15,
  slot: "weapon",
  modifiers: [{ stat: "intelligence", value: 2 }],
};

/** Espada de Ferro — arma melhor vendida na loja (ATK +4). */
export const ironSword: Equipment = {
  id: "iron_sword",
  name: "name.iron_sword",
  description: "desc.iron_sword",
  rarity: "uncommon",
  value: 60,
  slot: "weapon",
  modifiers: [{ stat: "strength", value: 4 }],
};
