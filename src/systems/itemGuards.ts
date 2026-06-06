import type { Consumable, Equipment, Item } from "../types";

/** Verifica se um item é um equipamento (possui slot e modificadores). */
export function isEquipment(item: Item): item is Equipment {
  return "slot" in item && "modifiers" in item;
}

/** Verifica se um item é um consumível (possui efeito). */
export function isConsumable(item: Item): item is Consumable {
  return "effect" in item;
}
