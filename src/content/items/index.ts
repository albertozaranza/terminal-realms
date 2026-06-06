import type { Item } from "../../types";
import { powerRing, vigorAmulet } from "./accessories";
import { leatherArmor } from "./armor";
import { largePotion, manaPotion, mediumPotion, smallPotion } from "./potions";
import { ironSword, oakStaff, rustySword, simpleBow } from "./weapons";

export { powerRing, vigorAmulet } from "./accessories";
export { leatherArmor } from "./armor";
export { largePotion, manaPotion, mediumPotion, smallPotion } from "./potions";
export { ironSword, oakStaff, rustySword, simpleBow } from "./weapons";

/** Registro de todos os itens por id. */
export const ITEMS: Readonly<Record<string, Item>> = {
  rusty_sword: rustySword,
  simple_bow: simpleBow,
  oak_staff: oakStaff,
  iron_sword: ironSword,
  leather_armor: leatherArmor,
  vigor_amulet: vigorAmulet,
  power_ring: powerRing,
  small_potion: smallPotion,
  medium_potion: mediumPotion,
  large_potion: largePotion,
  mana_potion: manaPotion,
};

/** Busca um item pelo id. Retorna undefined se não existir. */
export function findItemById(id: string): Item | undefined {
  return ITEMS[id];
}
