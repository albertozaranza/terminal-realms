import type { EquipmentSlot, Item } from "./Item";
import type { StatModifier } from "./StatModifier";

/** Item equipável em um slot, com modificadores de atributo. */
export interface Equipment extends Item {
  slot: EquipmentSlot;
  modifiers: StatModifier[];
}
