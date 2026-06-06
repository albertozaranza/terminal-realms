import { describe, expect, it } from "vitest";
import type { Player, Region } from "../types";
import { createInitialGameState, createInventory, createStatistics } from "./GameState";

const player: Player = {
  id: "hero",
  name: "Herói",
  level: 1,
  experience: 0,
  hp: 100,
  maxHp: 100,
  mana: 30,
  maxMana: 30,
  strength: 10,
  dexterity: 10,
  intelligence: 10,
  defense: 5,
  speed: 5,
  classId: "warrior",
  inventory: [],
};

const region: Region = {
  id: "starting_fields",
  name: "Campos Iniciais",
  minLevel: 1,
  maxLevel: 5,
  enemyPool: ["goblin", "lobo"],
  bossId: "goblin_king",
};

describe("createStatistics", () => {
  it("retorna todas as estatísticas zeradas", () => {
    expect(createStatistics()).toEqual({
      enemiesDefeated: 0,
      bossesDefeated: 0,
      totalGoldEarned: 0,
      totalExperienceEarned: 0,
      deaths: 0,
    });
  });
});

describe("createInventory", () => {
  it("retorna um inventário vazio sem ouro", () => {
    expect(createInventory()).toEqual({ items: [], gold: 0 });
  });
});

describe("createInitialGameState", () => {
  it("monta um estado inicial válido", () => {
    const state = createInitialGameState(player, region);

    expect(state.player).toBe(player);
    expect(state.currentRegion).toBe(region);
    expect(state.inventory).toEqual({ items: [], gold: 0 });
    expect(state.statistics.enemiesDefeated).toBe(0);
    expect(state.activeQuest).toBeUndefined();
  });

  it("não compartilha referência de inventário entre estados", () => {
    const a = createInitialGameState(player, region);
    const b = createInitialGameState(player, region);
    expect(a.inventory).not.toBe(b.inventory);
    expect(a.statistics).not.toBe(b.statistics);
  });
});
