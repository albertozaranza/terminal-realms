import { describe, expect, it } from "vitest";
import { hasEnemyArt, regionBand, regionTheme, renderEnemyArt } from "../index";

describe("renderEnemyArt", () => {
  it.each(["goblin", "wolf", "skeleton", "orc"])("has dedicated art for %s", (id) => {
    expect(hasEnemyArt(id)).toBe(true);
    expect(renderEnemyArt(id).length).toBeGreaterThan(0);
  });

  it("falls back to generic art for an unknown enemy", () => {
    expect(hasEnemyArt("dragon")).toBe(false);
    expect(renderEnemyArt("dragon").length).toBeGreaterThan(0);
  });
});

describe("regionTheme", () => {
  it("returns a dedicated theme for the starting fields", () => {
    expect(regionTheme("starting_fields").tile).toBe("🌾");
  });

  it("falls back to a generic theme for an unknown region", () => {
    const theme = regionTheme("nowhere");
    expect(theme.tile.length).toBeGreaterThan(0);
    expect(theme.color.length).toBeGreaterThan(0);
  });
});

describe("regionBand", () => {
  it("repeats the region tile the requested number of times", () => {
    const band = regionBand("starting_fields", 3);
    expect(band.split(" ").filter((tile) => tile === "🌾")).toHaveLength(3);
  });
});
