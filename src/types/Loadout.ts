import type { Equipment } from "./Equipment";
import type { EquipmentSlot } from "./Item";

/** Conjunto de equipamentos vestidos, indexado por slot. */
export type Loadout = Partial<Record<EquipmentSlot, Equipment>>;
