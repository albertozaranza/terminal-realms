import type { Consumable } from "../../types";

/** Poção Pequena — recupera 25 HP (CONTENT_BIBLE). */
export const smallPotion: Consumable = {
  id: "small_potion",
  name: "name.small_potion",
  description: "desc.small_potion",
  rarity: "common",
  value: 10,
  effect: { hp: 25 },
};

/** Poção Média — recupera 75 HP (CONTENT_BIBLE). */
export const mediumPotion: Consumable = {
  id: "medium_potion",
  name: "name.medium_potion",
  description: "desc.medium_potion",
  rarity: "uncommon",
  value: 25,
  effect: { hp: 75 },
};

/** Poção Grande — recupera 150 HP (CONTENT_BIBLE). */
export const largePotion: Consumable = {
  id: "large_potion",
  name: "name.large_potion",
  description: "desc.large_potion",
  rarity: "rare",
  value: 50,
  effect: { hp: 150 },
};

/** Poção de Mana — recupera 50 de Mana (CONTENT_BIBLE). */
export const manaPotion: Consumable = {
  id: "mana_potion",
  name: "name.mana_potion",
  description: "desc.mana_potion",
  rarity: "uncommon",
  value: 25,
  effect: { mana: 50 },
};
