import type { Equipment } from "../../types";

/** Amuleto do Vigor — exclusivo do mercador ambulante (maxHP +20). */
export const vigorAmulet: Equipment = {
  id: "vigor_amulet",
  name: "name.vigor_amulet",
  description: "desc.vigor_amulet",
  rarity: "rare",
  value: 120,
  slot: "amulet",
  modifiers: [{ stat: "maxHp", value: 20 }],
};

/** Anel do Poder — exclusivo do mercador ambulante (STR +3). */
export const powerRing: Equipment = {
  id: "power_ring",
  name: "name.power_ring",
  description: "desc.power_ring",
  rarity: "rare",
  value: 100,
  slot: "ring",
  modifiers: [{ stat: "strength", value: 3 }],
};
