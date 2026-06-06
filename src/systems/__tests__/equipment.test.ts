import { describe, expect, it } from "vitest";
import type { Equipment, Player } from "../../types";
import {
  applyLoadoutToPlayer,
  createLoadout,
  equip,
  getEquippedItems,
  getStatBonus,
  unequip,
} from "../equipment";

const sword: Equipment = {
  id: "sword",
  name: "Sword",
  description: "",
  rarity: "common",
  value: 10,
  slot: "weapon",
  modifiers: [{ stat: "strength", value: 2 }],
};

const betterSword: Equipment = {
  id: "better_sword",
  name: "Better Sword",
  description: "",
  rarity: "rare",
  value: 50,
  slot: "weapon",
  modifiers: [{ stat: "strength", value: 5 }],
};

const helmet: Equipment = {
  id: "helmet",
  name: "Helmet",
  description: "",
  rarity: "common",
  value: 10,
  slot: "helmet",
  modifiers: [{ stat: "defense", value: 3 }],
};

describe("equip / unequip", () => {
  it("equips an item into its slot", () => {
    const { loadout, previous } = equip(createLoadout(), sword);
    expect(loadout.weapon).toBe(sword);
    expect(previous).toBeUndefined();
  });

  it("returns the previous item when swapping in the same slot", () => {
    const first = equip(createLoadout(), sword).loadout;
    const { loadout, previous } = equip(first, betterSword);
    expect(loadout.weapon).toBe(betterSword);
    expect(previous).toBe(sword);
  });

  it("unequips a slot and returns the item", () => {
    const equipped = equip(createLoadout(), sword).loadout;
    const { loadout, previous } = unequip(equipped, "weapon");
    expect(loadout.weapon).toBeUndefined();
    expect(previous).toBe(sword);
  });

  it("does not mutate the original loadout", () => {
    const base = createLoadout();
    equip(base, sword);
    expect(base.weapon).toBeUndefined();
  });
});

describe("stat bonus", () => {
  it("lists equipped items in distinct slots", () => {
    let loadout = equip(createLoadout(), sword).loadout;
    loadout = equip(loadout, helmet).loadout;
    expect(getEquippedItems(loadout)).toHaveLength(2);
  });

  it("sums the modifiers for an attribute", () => {
    let loadout = equip(createLoadout(), sword).loadout; // strength +2
    loadout = equip(loadout, helmet).loadout; // defense +3
    expect(getStatBonus(loadout, "strength")).toBe(2);
    expect(getStatBonus(loadout, "defense")).toBe(3);
    expect(getStatBonus(loadout, "speed")).toBe(0);
  });
});

describe("applyLoadoutToPlayer", () => {
  const base: Player = {
    id: "player",
    name: "Hero",
    level: 1,
    experience: 0,
    hp: 50,
    maxHp: 100,
    mana: 10,
    maxMana: 30,
    strength: 10,
    dexterity: 8,
    intelligence: 6,
    defense: 5,
    speed: 5,
    classId: "warrior",
  };

  it("adds the loadout bonuses to the player's attributes", () => {
    let loadout = equip(createLoadout(), sword).loadout; // strength +2
    loadout = equip(loadout, helmet).loadout; // defense +3
    const effective = applyLoadoutToPlayer(base, loadout);
    expect(effective.strength).toBe(12);
    expect(effective.defense).toBe(8);
  });

  it("preserves current hp/mana and does not mutate the base player", () => {
    const loadout = equip(createLoadout(), helmet).loadout;
    const effective = applyLoadoutToPlayer(base, loadout);
    expect(effective.hp).toBe(50);
    expect(effective.mana).toBe(10);
    expect(base.defense).toBe(5);
  });

  it("returns a copy equal to the base when nothing is equipped", () => {
    expect(applyLoadoutToPlayer(base, createLoadout())).toEqual(base);
  });
});
