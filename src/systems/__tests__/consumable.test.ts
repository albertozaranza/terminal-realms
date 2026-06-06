import { describe, expect, it } from "vitest";
import type { Consumable, Player } from "../../types";
import { useConsumable } from "../consumable";

const base: Player = {
  id: "player",
  name: "Hero",
  level: 1,
  experience: 0,
  hp: 40,
  maxHp: 100,
  mana: 5,
  maxMana: 30,
  strength: 10,
  dexterity: 8,
  intelligence: 6,
  defense: 5,
  speed: 5,
  classId: "warrior",
};

const healPotion: Consumable = {
  id: "p",
  name: "Potion",
  description: "",
  rarity: "common",
  value: 10,
  effect: { hp: 25 },
};

const manaPotion: Consumable = {
  id: "m",
  name: "Mana Potion",
  description: "",
  rarity: "common",
  value: 10,
  effect: { mana: 50 },
};

describe("useConsumable", () => {
  it("restores hp without exceeding the maximum", () => {
    expect(useConsumable(base, healPotion).hp).toBe(65);
    expect(useConsumable({ ...base, hp: 90 }, healPotion).hp).toBe(100);
  });

  it("restores mana clamped to the maximum", () => {
    expect(useConsumable(base, manaPotion).mana).toBe(30);
  });

  it("does not mutate the original player", () => {
    useConsumable(base, healPotion);
    expect(base.hp).toBe(40);
  });
});
