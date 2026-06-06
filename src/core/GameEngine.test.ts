import { describe, expect, it } from "vitest";
import type { Player, Region } from "../types";
import { GameEngine } from "./GameEngine";
import { createInitialGameState } from "./GameState";

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
  id: "campos_iniciais",
  name: "Campos Iniciais",
  minLevel: 1,
  maxLevel: 5,
  enemyPool: ["goblin"],
  bossId: "rei_goblin",
};

function makeEngine(): GameEngine {
  return new GameEngine({ state: createInitialGameState(player, region) });
}

describe("GameEngine", () => {
  it("começa parada na fase de menu", () => {
    const engine = makeEngine();
    expect(engine.isRunning()).toBe(false);
    expect(engine.getPhase()).toBe("menu");
  });

  it("inicia corretamente", () => {
    const engine = makeEngine();
    engine.start();
    expect(engine.isRunning()).toBe(true);
    expect(engine.getPhase()).toBe("menu");
  });

  it("lança erro ao iniciar duas vezes", () => {
    const engine = makeEngine();
    engine.start();
    expect(() => engine.start()).toThrow();
  });

  it("expõe o estado fornecido", () => {
    const state = createInitialGameState(player, region);
    const engine = new GameEngine({ state });
    expect(engine.getState()).toBe(state);
  });

  it("transiciona entre fases quando rodando", () => {
    const engine = makeEngine();
    engine.start();
    engine.transitionTo("combat");
    expect(engine.getPhase()).toBe("combat");
  });

  it("não permite transição com a engine parada", () => {
    const engine = makeEngine();
    expect(() => engine.transitionTo("combat")).toThrow();
  });

  it("para quando solicitado", () => {
    const engine = makeEngine();
    engine.start();
    engine.stop();
    expect(engine.isRunning()).toBe(false);
  });
});
