import type { Inventory, Item } from "../types";
import { t } from "../utils";

/**
 * Sistema de inventário — funções puras que retornam um novo Inventory
 * sem mutar o original.
 */

/** Adiciona um item ao inventário. */
export function addItem(inventory: Inventory, item: Item): Inventory {
  return { ...inventory, items: [...inventory.items, item] };
}

/** Remove uma unidade do item informado. Lança erro se não existir. */
export function removeItem(inventory: Inventory, itemId: string): Inventory {
  const index = inventory.items.findIndex((item) => item.id === itemId);
  if (index === -1) {
    throw new Error(t("error.inventory.itemNotFound", { itemId }));
  }
  const items = inventory.items.filter((_, i) => i !== index);
  return { ...inventory, items };
}

/** Indica se o inventário possui ao menos uma unidade do item. */
export function hasItem(inventory: Inventory, itemId: string): boolean {
  return inventory.items.some((item) => item.id === itemId);
}

/** Conta quantas unidades do item existem no inventário. */
export function countItem(inventory: Inventory, itemId: string): number {
  return inventory.items.filter((item) => item.id === itemId).length;
}

/** Adiciona ouro ao inventário. */
export function addGold(inventory: Inventory, amount: number): Inventory {
  if (amount < 0) {
    throw new Error(t("error.common.negativeAmount", { amount }));
  }
  return { ...inventory, gold: inventory.gold + amount };
}

/** Remove ouro do inventário. Lança erro se for insuficiente. */
export function removeGold(inventory: Inventory, amount: number): Inventory {
  if (amount < 0) {
    throw new Error(t("error.common.negativeAmount", { amount }));
  }
  if (amount > inventory.gold) {
    throw new Error(t("error.inventory.notEnoughGold", { have: inventory.gold, need: amount }));
  }
  return { ...inventory, gold: inventory.gold - amount };
}
