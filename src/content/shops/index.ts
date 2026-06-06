import type { ShopOffer } from "../../types";
import { powerRing, vigorAmulet } from "../items/accessories";
import { leatherArmor } from "../items/armor";
import { largePotion, manaPotion, mediumPotion, smallPotion } from "../items/potions";
import { ironSword } from "../items/weapons";

/**
 * Estoque da loja fixa (sempre acessível pelo menu de exploração): poções
 * e equipamentos melhores. Equipamentos exigem nível mínimo para compra.
 */
// Preços de compra são definidos aqui (maiores que o `value`, que governa a
// venda a 50%) para manter a economia equilibrada — ver balanceamento da FASE 14.
export const GENERAL_SHOP: readonly ShopOffer[] = [
  { item: smallPotion, price: 20, requiredLevel: 1 },
  { item: mediumPotion, price: 45, requiredLevel: 1 },
  { item: largePotion, price: 90, requiredLevel: 1 },
  { item: manaPotion, price: 45, requiredLevel: 1 },
  { item: leatherArmor, price: 140, requiredLevel: 2 },
  { item: ironSword, price: 220, requiredLevel: 3 },
];

/**
 * Estoque exclusivo do mercador ambulante (evento aleatório): itens raros
 * que não aparecem na loja fixa.
 */
export const MERCHANT_STOCK: readonly ShopOffer[] = [
  { item: vigorAmulet, price: 480, requiredLevel: 4 },
  { item: powerRing, price: 420, requiredLevel: 4 },
  { item: largePotion, price: 90, requiredLevel: 1 },
];
