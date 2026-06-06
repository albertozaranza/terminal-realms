import { describe, expect, it } from "vitest";
import { findEnemyById, startingFields } from "../content";
import { WorldEngine } from "./WorldEngine";

describe("WorldEngine", () => {
  it("permite o jogador avançar e gera um encontro com inimigo", () => {
    const world = new WorldEngine(startingFields);
    const encounter = world.advance(() => 0);
    expect(encounter.type).toBe("enemy");
    expect(startingFields.enemyPool).toContain(encounter.enemyId);
  });

  it("o inimigo gerado é resolvível para conteúdo existente", () => {
    const world = new WorldEngine(startingFields);
    const { enemyId } = world.advance(() => 0.5);
    expect(findEnemyById(enemyId)).toBeDefined();
  });

  it("conta os passos a cada avanço", () => {
    const world = new WorldEngine(startingFields);
    world.advance();
    world.advance();
    expect(world.getSteps()).toBe(2);
  });

  it("lança erro ao avançar em região sem inimigos", () => {
    const world = new WorldEngine({ ...startingFields, enemyPool: [] });
    expect(() => world.advance()).toThrow();
  });

  it("gera um evento aleatório quando configurado", () => {
    const world = new WorldEngine(startingFields, {
      eventPool: ["chest", "ambush", "merchant"],
      eventChance: 0.3,
    });
    const encounter = world.advance(() => 0); // força evento
    expect(encounter.type).toBe("event");
    if (encounter.type === "event") {
      expect(encounter.eventId).toBe("chest");
    }
  });

  it("gera inimigo quando a rolagem não cai em evento", () => {
    const world = new WorldEngine(startingFields, {
      eventPool: ["chest"],
      eventChance: 0.3,
    });
    const encounter = world.advance(() => 0.99);
    expect(encounter.type).toBe("enemy");
  });

  it("nunca gera eventos sem eventPool", () => {
    const world = new WorldEngine(startingFields);
    expect(world.advance(() => 0).type).toBe("enemy");
  });
});
