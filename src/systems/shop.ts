import type { Inventory, Item, Player, ShopOffer } from "../types";
import { t } from "../utils";
import { addGold, addItem, removeGold, removeItem } from "./inventory";

/**
 * Sistema de loja — funções puras de compra e venda. A venda desvaloriza o
 * item (paga uma fração do seu valor), criando um dreno de ouro saudável.
 */

/** Fração do valor do item paga ao vendê-lo. */
export const SELL_RATE = 0.5;

/** Preço de venda de um item (fração do `value`, arredondada para baixo). */
export function sellPrice(item: Item): number {
  return Math.floor(item.value * SELL_RATE);
}

/** Indica se o jogador atende ao nível mínimo exigido pela oferta. */
export function meetsLevel(player: Player, offer: ShopOffer): boolean {
  return player.level >= offer.requiredLevel;
}

/** Indica se o jogador tem ouro suficiente para a oferta. */
export function canAfford(inventory: Inventory, offer: ShopOffer): boolean {
  return inventory.gold >= offer.price;
}

/**
 * Compra uma oferta: valida nível e saldo, debita o ouro e adiciona o item
 * ao inventário. Função pura — lança erro se o nível for insuficiente
 * (`removeGold` valida o ouro).
 */
export function buyOffer(inventory: Inventory, player: Player, offer: ShopOffer): Inventory {
  if (!meetsLevel(player, offer)) {
    throw new Error(t("error.shop.levelTooLow", { level: offer.requiredLevel }));
  }
  return addItem(removeGold(inventory, offer.price), offer.item);
}

/**
 * Vende uma unidade de um item do inventário pelo preço de venda. Função
 * pura — lança erro se o item não existir.
 */
export function sellItem(inventory: Inventory, itemId: string): Inventory {
  const slot = inventory.items.find((entry) => entry.item.id === itemId);
  if (!slot) {
    throw new Error(t("error.inventory.itemNotFound", { itemId }));
  }
  return addGold(removeItem(inventory, itemId), sellPrice(slot.item));
}
