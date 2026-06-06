import type { Equipment } from "../../types";

/** Armadura de Couro — peitoral vendido na loja (DEF +3). */
export const leatherArmor: Equipment = {
  id: "leather_armor",
  name: "name.leather_armor",
  description: "desc.leather_armor",
  rarity: "uncommon",
  value: 50,
  slot: "chest",
  modifiers: [{ stat: "defense", value: 3 }],
};
