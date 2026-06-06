import { describe, expect, it } from "vitest";
import { isConsumable, isEquipment } from "../../systems";
import type { Inventory } from "../../types";
import { findItemById, ITEMS, rustySword, smallPotion } from "./index";

const all = Object.values(ITEMS);

describe("estrutura de itens", () => {
  it.each(all)("$name tem campos base válidos", (item) => {
    expect(item.id.length).toBeGreaterThan(0);
    expect(item.name.length).toBeGreaterThan(0);
    expect(item.value).toBeGreaterThanOrEqual(0);
    expect(item.rarity).toBeDefined();
  });

  it("identifica equipamentos e consumíveis", () => {
    expect(isEquipment(rustySword)).toBe(true);
    expect(isConsumable(rustySword)).toBe(false);
    expect(isConsumable(smallPotion)).toBe(true);
    expect(isEquipment(smallPotion)).toBe(false);
  });

  it("itens podem existir em um inventário", () => {
    const inventory: Inventory = { items: [rustySword, smallPotion], gold: 0 };
    expect(inventory.items).toHaveLength(2);
    expect(inventory.items).toContain(rustySword);
  });

  it("encontra um item pelo id", () => {
    expect(findItemById("small_potion")).toBe(smallPotion);
    expect(findItemById("inexistente")).toBeUndefined();
  });
});
