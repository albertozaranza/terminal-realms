import { describe, expect, it } from "vitest";
import { center, columns, divider, panel, visibleLength } from "../panel";

const ESC = String.fromCharCode(27);

describe("visibleLength", () => {
  it("ignores ANSI color codes when measuring", () => {
    expect(visibleLength(`${ESC}[32mabc${ESC}[39m`)).toBe(3);
  });

  it("counts plain text as-is", () => {
    expect(visibleLength("hello")).toBe(5);
  });
});

describe("center", () => {
  it("pads shorter lines to roughly center them", () => {
    expect(center("ab", 6)).toBe("  ab");
  });

  it("does not pad when the line is wider than the width", () => {
    expect(center("abcdef", 4)).toBe("abcdef");
  });
});

describe("divider", () => {
  it("repeats the character to the requested width", () => {
    expect(divider(4)).toBe("────");
  });

  it("never produces a negative-length string", () => {
    expect(divider(-3)).toBe("");
  });
});

describe("columns", () => {
  it("joins blocks side by side, padding to equal heights", () => {
    const result = columns(["a\nbb", "c"], 1).split("\n");
    expect(result[0]).toBe("a  c");
    expect(result[1]).toBe("bb  ");
  });
});

describe("panel", () => {
  it("wraps content in a bordered box", () => {
    const boxed = panel("hi");
    expect(boxed).toContain("hi");
    expect(boxed.split("\n").length).toBeGreaterThan(1);
  });

  it("respects a fixed total width", () => {
    const boxed = panel("hi", { width: 20 });
    const widest = Math.max(...boxed.split("\n").map(visibleLength));
    expect(widest).toBe(20);
  });
});
