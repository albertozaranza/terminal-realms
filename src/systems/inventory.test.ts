import { describe, expect, it } from "vitest";
import type { Inventory, Item } from "../types";
import { addGold, addItem, countItem, hasItem, removeGold, removeItem } from "./inventory";

const sword: Item = {
  id: "espada",
  name: "Espada",
  description: "",
  rarity: "common",
  value: 10,
};
const potion: Item = {
  id: "pocao",
  name: "Poção",
  description: "",
  rarity: "common",
  value: 5,
};

function empty(): Inventory {
  return { items: [], gold: 0 };
}

describe("addItem / removeItem", () => {
  it("adiciona um item", () => {
    const inv = addItem(empty(), sword);
    expect(inv.items).toHaveLength(1);
    expect(hasItem(inv, "espada")).toBe(true);
  });

  it("remove um item existente", () => {
    const inv = removeItem(addItem(empty(), sword), "espada");
    expect(inv.items).toHaveLength(0);
  });

  it("remove apenas uma unidade", () => {
    let inv = addItem(addItem(empty(), sword), sword);
    expect(countItem(inv, "espada")).toBe(2);
    inv = removeItem(inv, "espada");
    expect(countItem(inv, "espada")).toBe(1);
  });

  it("lança erro ao remover item inexistente", () => {
    expect(() => removeItem(empty(), "espada")).toThrow();
  });

  it("não muta o inventário original", () => {
    const inv = empty();
    addItem(inv, potion);
    expect(inv.items).toHaveLength(0);
  });
});

describe("gold", () => {
  it("adiciona ouro", () => {
    expect(addGold(empty(), 100).gold).toBe(100);
  });

  it("remove ouro", () => {
    expect(removeGold({ items: [], gold: 100 }, 30).gold).toBe(70);
  });

  it("lança erro para ouro insuficiente", () => {
    expect(() => removeGold(empty(), 10)).toThrow();
  });

  it("lança erro para valores negativos", () => {
    expect(() => addGold(empty(), -1)).toThrow();
    expect(() => removeGold(empty(), -1)).toThrow();
  });
});
