import { describe, expect, it } from "vitest";
import type { Equipment, Inventory, Player, ShopOffer } from "../../types";
import { addItem } from "../inventory";
import {
  buyOffer,
  canAfford,
  maxAffordable,
  meetsLevel,
  SELL_RATE,
  sellItem,
  sellPrice,
} from "../shop";

const armor: Equipment = {
  id: "leather_armor",
  name: "Leather Armor",
  description: "",
  rarity: "uncommon",
  value: 50,
  slot: "chest",
  modifiers: [{ stat: "defense", value: 3 }],
};

const offer: ShopOffer = { item: armor, price: 50, requiredLevel: 2 };

function player(level: number): Player {
  return {
    id: "p",
    name: "Hero",
    level,
    experience: 0,
    hp: 100,
    maxHp: 100,
    mana: 30,
    maxMana: 30,
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    defense: 5,
    speed: 5,
    classId: "warrior",
  };
}

describe("shop pricing", () => {
  it("sells for a fraction of the value (devalues)", () => {
    expect(sellPrice(armor)).toBe(Math.floor(50 * SELL_RATE));
    expect(sellPrice(armor)).toBeLessThan(armor.value);
  });
});

describe("buyOffer", () => {
  it("debits the gold and adds the item", () => {
    const inventory: Inventory = { items: [], gold: 100 };
    const result = buyOffer(inventory, player(2), offer);
    expect(result.gold).toBe(50);
    expect(result.items.map((slot) => slot.item)).toContain(armor);
  });

  it("throws when the player level is too low", () => {
    const inventory: Inventory = { items: [], gold: 100 };
    expect(() => buyOffer(inventory, player(1), offer)).toThrow();
  });

  it("throws when there is not enough gold", () => {
    const inventory: Inventory = { items: [], gold: 10 };
    expect(() => buyOffer(inventory, player(2), offer)).toThrow();
  });

  it("buys multiple units, debiting the total", () => {
    const inventory: Inventory = { items: [], gold: 200 };
    const result = buyOffer(inventory, player(2), offer, 3);
    expect(result.gold).toBe(50); // 200 - 50*3
    const slot = result.items.find((entry) => entry.item.id === "leather_armor");
    // Equipamento não empilha: 3 pilhas individuais.
    expect(result.items.filter((entry) => entry.item.id === "leather_armor")).toHaveLength(3);
    expect(slot).toBeDefined();
  });

  it("maxAffordable reflects the gold and price", () => {
    expect(maxAffordable({ items: [], gold: 175 }, offer)).toBe(3); // floor(175/50)
    expect(maxAffordable({ items: [], gold: 40 }, offer)).toBe(0);
  });
});

describe("sellItem", () => {
  it("removes the item and credits the sell price", () => {
    const inventory = addItem({ items: [], gold: 0 }, armor);
    const result = sellItem(inventory, "leather_armor");
    expect(result.items).toHaveLength(0);
    expect(result.gold).toBe(sellPrice(armor));
  });

  it("throws when selling a missing item", () => {
    expect(() => sellItem({ items: [], gold: 0 }, "ghost")).toThrow();
  });

  it("sells multiple units of a stack, crediting the total", () => {
    const potion = { id: "potion", name: "Potion", description: "", rarity: "common", value: 20 };
    const inventory: Inventory = { items: [{ item: potion, quantity: 5 }], gold: 0 };
    const result = sellItem(inventory, "potion", 3);
    expect(result.items[0].quantity).toBe(2);
    expect(result.gold).toBe(sellPrice(potion) * 3);
  });

  it("clamps the sell quantity to what is available", () => {
    const potion = { id: "potion", name: "Potion", description: "", rarity: "common", value: 20 };
    const inventory: Inventory = { items: [{ item: potion, quantity: 2 }], gold: 0 };
    const result = sellItem(inventory, "potion", 99);
    expect(result.items).toHaveLength(0);
    expect(result.gold).toBe(sellPrice(potion) * 2);
  });
});

describe("guards", () => {
  it("meetsLevel and canAfford reflect the requirements", () => {
    expect(meetsLevel(player(2), offer)).toBe(true);
    expect(meetsLevel(player(1), offer)).toBe(false);
    expect(canAfford({ items: [], gold: 50 }, offer)).toBe(true);
    expect(canAfford({ items: [], gold: 49 }, offer)).toBe(false);
  });
});
