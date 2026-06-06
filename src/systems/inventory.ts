import type { Inventory, Item } from "../types";
import { t } from "../utils";
import { isEquipment } from "./itemGuards";

/**
 * Sistema de inventário — funções puras que retornam um novo Inventory
 * sem mutar o original. Itens empilháveis agrupam-se em pilhas com
 * quantidade; equipamentos ocupam uma pilha individual cada.
 */

/** Indica se o item pode empilhar com outro de mesmo id (tudo que não é equipamento). */
function isStackable(item: Item): boolean {
  return !isEquipment(item);
}

/** Adiciona uma unidade do item ao inventário, empilhando quando possível. */
export function addItem(inventory: Inventory, item: Item): Inventory {
  if (isStackable(item)) {
    const index = inventory.items.findIndex((slot) => slot.item.id === item.id);
    if (index !== -1) {
      const items = inventory.items.map((slot, i) =>
        i === index ? { ...slot, quantity: slot.quantity + 1 } : slot,
      );
      return { ...inventory, items };
    }
  }
  return { ...inventory, items: [...inventory.items, { item, quantity: 1 }] };
}

/** Remove uma unidade do item informado. Lança erro se não existir. */
export function removeItem(inventory: Inventory, itemId: string): Inventory {
  const index = inventory.items.findIndex((slot) => slot.item.id === itemId);
  if (index === -1) {
    throw new Error(t("error.inventory.itemNotFound", { itemId }));
  }
  const slot = inventory.items[index];
  const items =
    slot.quantity > 1
      ? inventory.items.map((s, i) => (i === index ? { ...s, quantity: s.quantity - 1 } : s))
      : inventory.items.filter((_, i) => i !== index);
  return { ...inventory, items };
}

/** Indica se o inventário possui ao menos uma unidade do item. */
export function hasItem(inventory: Inventory, itemId: string): boolean {
  return inventory.items.some((slot) => slot.item.id === itemId);
}

/** Conta quantas unidades do item existem no inventário (soma as pilhas). */
export function countItem(inventory: Inventory, itemId: string): number {
  return inventory.items
    .filter((slot) => slot.item.id === itemId)
    .reduce((total, slot) => total + slot.quantity, 0);
}

/** Total de unidades no inventário, somando todas as pilhas. */
export function totalItems(inventory: Inventory): number {
  return inventory.items.reduce((total, slot) => total + slot.quantity, 0);
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
