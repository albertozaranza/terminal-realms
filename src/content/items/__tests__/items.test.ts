import { describe, expect, it } from "vitest";
import { isConsumable, isEquipment } from "../../../systems";
import type { Inventory } from "../../../types";
import { findItemById, ITEMS, rustySword, smallPotion } from "../index";

const all = Object.values(ITEMS);

describe("item structure", () => {
  it.each(all)("$id has valid base fields", (item) => {
    expect(item.id.length).toBeGreaterThan(0);
    expect(item.name.length).toBeGreaterThan(0);
    expect(item.value).toBeGreaterThanOrEqual(0);
    expect(item.rarity).toBeDefined();
  });

  it("identifies equipment and consumables", () => {
    expect(isEquipment(rustySword)).toBe(true);
    expect(isConsumable(rustySword)).toBe(false);
    expect(isConsumable(smallPotion)).toBe(true);
    expect(isEquipment(smallPotion)).toBe(false);
  });

  it("items can live in an inventory", () => {
    const inventory: Inventory = {
      items: [
        { item: rustySword, quantity: 1 },
        { item: smallPotion, quantity: 1 },
      ],
      gold: 0,
    };
    expect(inventory.items).toHaveLength(2);
    expect(inventory.items.map((slot) => slot.item)).toContain(rustySword);
  });

  it("finds an item by id", () => {
    expect(findItemById("small_potion")).toBe(smallPotion);
    expect(findItemById("missing")).toBeUndefined();
  });
});
