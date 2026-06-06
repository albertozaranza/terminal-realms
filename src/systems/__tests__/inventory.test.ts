import { describe, expect, it } from "vitest";
import type { Inventory, Item } from "../../types";
import { addGold, addItem, countItem, hasItem, removeGold, removeItem } from "../inventory";

const sword: Item = {
  id: "sword",
  name: "Sword",
  description: "",
  rarity: "common",
  value: 10,
};
const potion: Item = {
  id: "potion",
  name: "Potion",
  description: "",
  rarity: "common",
  value: 5,
};

function empty(): Inventory {
  return { items: [], gold: 0 };
}

describe("addItem / removeItem", () => {
  it("adds an item", () => {
    const inv = addItem(empty(), sword);
    expect(inv.items).toHaveLength(1);
    expect(hasItem(inv, "sword")).toBe(true);
  });

  it("removes an existing item", () => {
    const inv = removeItem(addItem(empty(), sword), "sword");
    expect(inv.items).toHaveLength(0);
  });

  it("removes only a single unit", () => {
    let inv = addItem(addItem(empty(), sword), sword);
    expect(countItem(inv, "sword")).toBe(2);
    inv = removeItem(inv, "sword");
    expect(countItem(inv, "sword")).toBe(1);
  });

  it("throws when removing a missing item", () => {
    expect(() => removeItem(empty(), "sword")).toThrow();
  });

  it("does not mutate the original inventory", () => {
    const inv = empty();
    addItem(inv, potion);
    expect(inv.items).toHaveLength(0);
  });
});

describe("gold", () => {
  it("adds gold", () => {
    expect(addGold(empty(), 100).gold).toBe(100);
  });

  it("removes gold", () => {
    expect(removeGold({ items: [], gold: 100 }, 30).gold).toBe(70);
  });

  it("throws for insufficient gold", () => {
    expect(() => removeGold(empty(), 10)).toThrow();
  });

  it("throws for negative amounts", () => {
    expect(() => addGold(empty(), -1)).toThrow();
    expect(() => removeGold(empty(), -1)).toThrow();
  });
});
