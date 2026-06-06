import { describe, expect, it } from "vitest";
import { START_REGION } from "../../core";
import { findEnemyById } from "../enemies";
import { findRegionById, REGIONS } from "./index";

describe("região inicial", () => {
  it("corresponde a START_REGION", () => {
    expect(findRegionById(START_REGION)).toBeDefined();
  });

  it("tem faixa de níveis válida", () => {
    const region = findRegionById(START_REGION);
    expect(region).toBeDefined();
    if (!region) {
      throw new Error("região inicial não encontrada");
    }
    expect(region.minLevel).toBeGreaterThanOrEqual(1);
    expect(region.maxLevel).toBeGreaterThanOrEqual(region.minLevel);
  });

  it("tem pool de inimigos que existem (exploração possível)", () => {
    const region = REGIONS[START_REGION];
    expect(region.enemyPool.length).toBeGreaterThan(0);
    for (const enemyId of region.enemyPool) {
      expect(findEnemyById(enemyId)).toBeDefined();
    }
  });

  it("define um chefe", () => {
    expect(REGIONS[START_REGION].bossId.length).toBeGreaterThan(0);
  });
});
