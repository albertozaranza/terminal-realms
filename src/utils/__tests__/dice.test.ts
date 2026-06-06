import { describe, expect, it } from "vitest";
import { roll, rollDice, rollDie } from "../dice";

describe("rollDie", () => {
  it("returns a value between 1 and sides", () => {
    for (let i = 0; i < 1000; i++) {
      const value = rollDie(20);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(20);
    }
  });

  it("uses the provided rng", () => {
    expect(rollDie(6, () => 0)).toBe(1);
    expect(rollDie(6, () => 0.999999)).toBe(6);
  });

  it("throws for an invalid number of sides", () => {
    expect(() => rollDie(0)).toThrow();
    expect(() => rollDie(2.5)).toThrow();
  });
});

describe("rollDice", () => {
  it("sums the rolled dice", () => {
    // rng fixed at 0 => each die returns 1; 3 dice => 3.
    expect(rollDice(3, 6, () => 0)).toBe(3);
  });

  it("throws for an invalid count", () => {
    expect(() => rollDice(0, 6)).toThrow();
  });
});

describe("roll (notation)", () => {
  it("parses NdM without a modifier", () => {
    expect(roll("2d6", () => 0)).toBe(2);
  });

  it("applies a positive modifier", () => {
    expect(roll("2d6+3", () => 0)).toBe(5);
  });

  it("applies a negative modifier", () => {
    expect(roll("3d4-1", () => 0)).toBe(2);
  });

  it("ignores surrounding whitespace", () => {
    expect(roll("  1d20  ", () => 0)).toBe(1);
  });

  it("throws for invalid notation", () => {
    expect(() => roll("abc")).toThrow();
    expect(() => roll("d6")).toThrow();
  });
});
