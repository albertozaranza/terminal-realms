import { describe, expect, it } from "vitest";
import { clamp, percentOf, sum } from "../math";

describe("clamp", () => {
  it("keeps a value within the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to the minimum", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it("clamps to the maximum", () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it("throws when min > max", () => {
    expect(() => clamp(5, 10, 0)).toThrow();
  });
});

describe("sum", () => {
  it("sums the values", () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  it("returns 0 for an empty list", () => {
    expect(sum([])).toBe(0);
  });
});

describe("percentOf", () => {
  it("computes the percentage of a value", () => {
    expect(percentOf(50, 150)).toBe(75);
    expect(percentOf(200, 50)).toBe(100);
  });
});
