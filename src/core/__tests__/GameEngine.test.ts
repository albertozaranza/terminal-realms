import { describe, expect, it } from "vitest";
import type { Player, Region } from "../../types";
import { GameEngine } from "../GameEngine";
import { createInitialGameState } from "../GameState";

const player: Player = {
  id: "hero",
  name: "Hero",
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
  name: "name.starting_fields",
  minLevel: 1,
  maxLevel: 5,
  enemyPool: ["goblin"],
  bossId: "goblin_king",
};

function makeEngine(): GameEngine {
  return new GameEngine({ state: createInitialGameState(player, region) });
}

describe("GameEngine", () => {
  it("starts stopped on the menu phase", () => {
    const engine = makeEngine();
    expect(engine.isRunning()).toBe(false);
    expect(engine.getPhase()).toBe("menu");
  });

  it("starts correctly", () => {
    const engine = makeEngine();
    engine.start();
    expect(engine.isRunning()).toBe(true);
    expect(engine.getPhase()).toBe("menu");
  });

  it("throws when started twice", () => {
    const engine = makeEngine();
    engine.start();
    expect(() => engine.start()).toThrow();
  });

  it("exposes the provided state", () => {
    const state = createInitialGameState(player, region);
    const engine = new GameEngine({ state });
    expect(engine.getState()).toBe(state);
  });

  it("transitions between phases while running", () => {
    const engine = makeEngine();
    engine.start();
    engine.transitionTo("combat");
    expect(engine.getPhase()).toBe("combat");
  });

  it("does not allow transitions while stopped", () => {
    const engine = makeEngine();
    expect(() => engine.transitionTo("combat")).toThrow();
  });

  it("stops when requested", () => {
    const engine = makeEngine();
    engine.start();
    engine.stop();
    expect(engine.isRunning()).toBe(false);
  });
});
