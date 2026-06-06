import { describe, expect, it } from "vitest";
import type { Equipment, Inventory, Player, ShopOffer } from "../../types";
import { addItem } from "../inventory";
import { buyOffer, canAfford, meetsLevel, SELL_RATE, sellItem, sellPrice } from "../shop";

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
});

describe("guards", () => {
  it("meetsLevel and canAfford reflect the requirements", () => {
    expect(meetsLevel(player(2), offer)).toBe(true);
    expect(meetsLevel(player(1), offer)).toBe(false);
    expect(canAfford({ items: [], gold: 50 }, offer)).toBe(true);
    expect(canAfford({ items: [], gold: 49 }, offer)).toBe(false);
  });
});
