import { describe, expect, it } from "vitest";
import { chance, pick, type Rng, randomFloat, randomInt, weightedPick } from "../random";

/** Creates an rng that returns the provided values in sequence. */
function seq(...values: number[]): Rng {
  let i = 0;
  return () => values[i++ % values.length];
}

describe("randomInt", () => {
  it("returns the minimum when rng is 0", () => {
    expect(randomInt(1, 6, () => 0)).toBe(1);
  });

  it("returns the maximum when rng approaches 1", () => {
    expect(randomInt(1, 6, () => 0.999999)).toBe(6);
  });

  it("stays within bounds across many iterations", () => {
    for (let i = 0; i < 1000; i++) {
      const value = randomInt(1, 6);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it("throws when min > max", () => {
    expect(() => randomInt(5, 1)).toThrow();
  });
});

describe("randomFloat", () => {
  it("returns a value within the range", () => {
    expect(randomFloat(0, 10, () => 0.5)).toBe(5);
  });

  it("throws when min > max", () => {
    expect(() => randomFloat(5, 1)).toThrow();
  });
});

describe("chance", () => {
  it("returns true when rng < probability", () => {
    expect(chance(0.5, () => 0.4)).toBe(true);
  });

  it("returns false when rng >= probability", () => {
    expect(chance(0.5, () => 0.5)).toBe(false);
  });

  it("throws for a probability outside [0, 1]", () => {
    expect(() => chance(1.5)).toThrow();
    expect(() => chance(-0.1)).toThrow();
  });
});

describe("pick", () => {
  it("selects the element according to the rng", () => {
    expect(pick(["a", "b", "c"], () => 0)).toBe("a");
    expect(pick(["a", "b", "c"], () => 0.999999)).toBe("c");
  });

  it("throws for an empty array", () => {
    expect(() => pick([])).toThrow();
  });
});

describe("weightedPick", () => {
  const entries = [
    { item: "common", weight: 70 },
    { item: "rare", weight: 30 },
  ];

  it("selects the first item for a low roll", () => {
    expect(weightedPick(entries, seq(0))).toBe("common");
  });

  it("selects the second item for a high roll", () => {
    expect(weightedPick(entries, seq(0.99))).toBe("rare");
  });

  it("throws for an empty list", () => {
    expect(() => weightedPick([])).toThrow();
  });

  it("throws when the weight sum is zero", () => {
    expect(() => weightedPick([{ item: "x", weight: 0 }])).toThrow();
  });

  it("throws for a negative weight", () => {
    expect(() => weightedPick([{ item: "x", weight: -1 }])).toThrow();
  });
});
