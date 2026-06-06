import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../classes";
import type { Player } from "../../types";
import { createCharacter } from "../createCharacter";
import { computeDamage, getPlayerAttack } from "../damage";

describe("computeDamage", () => {
  it("applies attack - defense / 2", () => {
    expect(computeDamage(10, 4)).toBe(8);
  });

  it("rounds down", () => {
    expect(computeDamage(10, 5)).toBe(7); // 10 - 2.5 = 7.5 -> 7
  });

  it("respects the minimum damage of 1", () => {
    expect(computeDamage(2, 100)).toBe(1);
  });
});

describe("getPlayerAttack", () => {
  it("uses the highest combat attribute", () => {
    const player: Player = createCharacter({ name: "H", characterClass: new WarriorClass() });
    expect(getPlayerAttack(player)).toBe(
      Math.max(player.strength, player.dexterity, player.intelligence),
    );
  });
});
