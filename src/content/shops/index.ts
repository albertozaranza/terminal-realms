import type { ShopOffer } from "../../types";
import { powerRing, vigorAmulet } from "../items/accessories";
import { leatherArmor } from "../items/armor";
import { largePotion, manaPotion, mediumPotion, smallPotion } from "../items/potions";
import { ironSword } from "../items/weapons";

/**
 * Estoque da loja fixa (sempre acessível pelo menu de exploração): poções
 * e equipamentos melhores. Equipamentos exigem nível mínimo para compra.
 */
export const GENERAL_SHOP: readonly ShopOffer[] = [
  { item: smallPotion, price: smallPotion.value, requiredLevel: 1 },
  { item: mediumPotion, price: mediumPotion.value, requiredLevel: 1 },
  { item: largePotion, price: largePotion.value, requiredLevel: 1 },
  { item: manaPotion, price: manaPotion.value, requiredLevel: 1 },
  { item: leatherArmor, price: leatherArmor.value, requiredLevel: 2 },
  { item: ironSword, price: ironSword.value, requiredLevel: 3 },
];

/**
 * Estoque exclusivo do mercador ambulante (evento aleatório): itens raros
 * que não aparecem na loja fixa.
 */
export const MERCHANT_STOCK: readonly ShopOffer[] = [
  { item: vigorAmulet, price: vigorAmulet.value, requiredLevel: 4 },
  { item: powerRing, price: powerRing.value, requiredLevel: 4 },
  { item: largePotion, price: largePotion.value, requiredLevel: 1 },
];
