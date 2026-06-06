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

/** Quantidade máxima da oferta que o jogador consegue pagar com o ouro atual. */
export function maxAffordable(inventory: Inventory, offer: ShopOffer): number {
  if (offer.price <= 0) {
    return 0;
  }
  return Math.floor(inventory.gold / offer.price);
}

/**
 * Compra `quantity` unidades de uma oferta: valida nível e saldo, debita o
 * ouro total e adiciona os itens ao inventário. Função pura — lança erro se
 * o nível for insuficiente (`removeGold` valida o ouro).
 */
export function buyOffer(
  inventory: Inventory,
  player: Player,
  offer: ShopOffer,
  quantity = 1,
): Inventory {
  if (!meetsLevel(player, offer)) {
    throw new Error(t("error.shop.levelTooLow", { level: offer.requiredLevel }));
  }
  const amount = Math.max(1, quantity);
  let result = removeGold(inventory, offer.price * amount);
  for (let i = 0; i < amount; i++) {
    result = addItem(result, offer.item);
  }
  return result;
}

/**
 * Vende `quantity` unidades de um item do inventário pelo preço de venda
 * (limitado à quantidade disponível). Credita o total e remove as unidades.
 * Função pura — lança erro se o item não existir.
 */
export function sellItem(inventory: Inventory, itemId: string, quantity = 1): Inventory {
  const slot = inventory.items.find((entry) => entry.item.id === itemId);
  if (!slot) {
    throw new Error(t("error.inventory.itemNotFound", { itemId }));
  }
  const amount = Math.max(1, Math.min(quantity, slot.quantity));
  let result = inventory;
  for (let i = 0; i < amount; i++) {
    result = removeItem(result, itemId);
  }
  return addGold(result, sellPrice(slot.item) * amount);
}
