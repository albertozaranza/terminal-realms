import type { Item } from "../../types";
import { largePotion, manaPotion, mediumPotion, smallPotion } from "./potions";
import { oakStaff, rustySword, simpleBow } from "./weapons";

export { largePotion, manaPotion, mediumPotion, smallPotion } from "./potions";
export { oakStaff, rustySword, simpleBow } from "./weapons";

/** Registro de todos os itens por id. */
export const ITEMS: Readonly<Record<string, Item>> = {
  rusty_sword: rustySword,
  simple_bow: simpleBow,
  oak_staff: oakStaff,
  small_potion: smallPotion,
  medium_potion: mediumPotion,
  large_potion: largePotion,
  mana_potion: manaPotion,
};

/** Busca um item pelo id. Retorna undefined se não existir. */
export function findItemById(id: string): Item | undefined {
  return ITEMS[id];
}
