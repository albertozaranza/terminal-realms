import { describe, expect, it } from "vitest";
import { START_REGION } from "../../../core";
import { findEnemyById } from "../../enemies";
import { findRegionById, REGIONS } from "../index";

describe("starting region", () => {
  it("matches START_REGION", () => {
    expect(findRegionById(START_REGION)).toBeDefined();
  });

  it("has a valid level range", () => {
    const region = findRegionById(START_REGION);
    expect(region).toBeDefined();
    if (!region) {
      throw new Error("starting region not found");
    }
    expect(region.minLevel).toBeGreaterThanOrEqual(1);
    expect(region.maxLevel).toBeGreaterThanOrEqual(region.minLevel);
  });

  it("has a pool of existing enemies (exploration possible)", () => {
    const region = REGIONS[START_REGION];
    expect(region.enemyPool.length).toBeGreaterThan(0);
    for (const enemyId of region.enemyPool) {
      expect(findEnemyById(enemyId)).toBeDefined();
    }
  });

  it("defines a boss", () => {
    expect(REGIONS[START_REGION].bossId.length).toBeGreaterThan(0);
  });
});
