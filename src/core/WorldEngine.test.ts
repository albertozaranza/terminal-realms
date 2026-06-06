import { describe, expect, it } from "vitest";
import { camposIniciais, findEnemyById } from "../content";
import { WorldEngine } from "./WorldEngine";

describe("WorldEngine", () => {
  it("permite o jogador avançar e gera um encontro com inimigo", () => {
    const world = new WorldEngine(camposIniciais);
    const encounter = world.advance(() => 0);
    expect(encounter.type).toBe("enemy");
    expect(camposIniciais.enemyPool).toContain(encounter.enemyId);
  });

  it("o inimigo gerado é resolvível para conteúdo existente", () => {
    const world = new WorldEngine(camposIniciais);
    const { enemyId } = world.advance(() => 0.5);
    expect(findEnemyById(enemyId)).toBeDefined();
  });

  it("conta os passos a cada avanço", () => {
    const world = new WorldEngine(camposIniciais);
    world.advance();
    world.advance();
    expect(world.getSteps()).toBe(2);
  });

  it("lança erro ao avançar em região sem inimigos", () => {
    const world = new WorldEngine({ ...camposIniciais, enemyPool: [] });
    expect(() => world.advance()).toThrow();
  });
});
