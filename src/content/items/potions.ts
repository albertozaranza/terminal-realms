import type { Consumable } from "../../types";

/** Poção Pequena — recupera 25 HP (CONTENT_BIBLE). */
export const pocaoPequena: Consumable = {
  id: "pocao_pequena",
  name: "Poção Pequena",
  description: "Recupera 25 de HP.",
  rarity: "common",
  value: 10,
  effect: { hp: 25 },
};

/** Poção Média — recupera 75 HP (CONTENT_BIBLE). */
export const pocaoMedia: Consumable = {
  id: "pocao_media",
  name: "Poção Média",
  description: "Recupera 75 de HP.",
  rarity: "uncommon",
  value: 25,
  effect: { hp: 75 },
};

/** Poção Grande — recupera 150 HP (CONTENT_BIBLE). */
export const pocaoGrande: Consumable = {
  id: "pocao_grande",
  name: "Poção Grande",
  description: "Recupera 150 de HP.",
  rarity: "rare",
  value: 50,
  effect: { hp: 150 },
};

/** Poção de Mana — recupera 50 de Mana (CONTENT_BIBLE). */
export const pocaoMana: Consumable = {
  id: "pocao_mana",
  name: "Poção de Mana",
  description: "Recupera 50 de Mana.",
  rarity: "uncommon",
  value: 25,
  effect: { mana: 50 },
};
