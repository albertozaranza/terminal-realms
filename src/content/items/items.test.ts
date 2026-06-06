import { describe, expect, it } from "vitest";
import { isConsumable, isEquipment } from "../../systems";
import type { Inventory } from "../../types";
import { espadaEnferrujada, findItemById, ITEMS, pocaoPequena } from "./index";

const all = Object.values(ITEMS);

describe("estrutura de itens", () => {
  it.each(all)("$name tem campos base válidos", (item) => {
    expect(item.id.length).toBeGreaterThan(0);
    expect(item.name.length).toBeGreaterThan(0);
    expect(item.value).toBeGreaterThanOrEqual(0);
    expect(item.rarity).toBeDefined();
  });

  it("identifica equipamentos e consumíveis", () => {
    expect(isEquipment(espadaEnferrujada)).toBe(true);
    expect(isConsumable(espadaEnferrujada)).toBe(false);
    expect(isConsumable(pocaoPequena)).toBe(true);
    expect(isEquipment(pocaoPequena)).toBe(false);
  });

  it("itens podem existir em um inventário", () => {
    const inventory: Inventory = { items: [espadaEnferrujada, pocaoPequena], gold: 0 };
    expect(inventory.items).toHaveLength(2);
    expect(inventory.items).toContain(espadaEnferrujada);
  });

  it("encontra um item pelo id", () => {
    expect(findItemById("pocao_pequena")).toBe(pocaoPequena);
    expect(findItemById("inexistente")).toBeUndefined();
  });
});
