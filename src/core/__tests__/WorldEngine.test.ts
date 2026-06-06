import { describe, expect, it } from "vitest";
import { findEnemyById, startingFields } from "../../content";
import { WorldEngine } from "../WorldEngine";

describe("WorldEngine", () => {
  it("lets the player advance and generates an enemy encounter", () => {
    const world = new WorldEngine(startingFields);
    const encounter = world.advance(() => 0);
    expect(encounter.type).toBe("enemy");
    expect(startingFields.enemyPool).toContain(encounter.enemyId);
  });

  it("generates an enemy that resolves to existing content", () => {
    const world = new WorldEngine(startingFields);
    const { enemyId } = world.advance(() => 0.5);
    expect(findEnemyById(enemyId)).toBeDefined();
  });

  it("counts the steps on each advance", () => {
    const world = new WorldEngine(startingFields);
    world.advance();
    world.advance();
    expect(world.getSteps()).toBe(2);
  });

  it("throws when advancing in a region with no enemies", () => {
    const world = new WorldEngine({ ...startingFields, enemyPool: [] });
    expect(() => world.advance()).toThrow();
  });

  it("generates a random event when configured", () => {
    const world = new WorldEngine(startingFields, {
      eventPool: ["chest", "ambush", "merchant"],
      eventChance: 0.3,
    });
    const encounter = world.advance(() => 0); // forces an event
    expect(encounter.type).toBe("event");
    if (encounter.type === "event") {
      expect(encounter.eventId).toBe("chest");
    }
  });

  it("generates an enemy when the roll misses the event chance", () => {
    const world = new WorldEngine(startingFields, {
      eventPool: ["chest"],
      eventChance: 0.3,
    });
    const encounter = world.advance(() => 0.99);
    expect(encounter.type).toBe("enemy");
  });

  it("never generates events without an eventPool", () => {
    const world = new WorldEngine(startingFields);
    expect(world.advance(() => 0).type).toBe("enemy");
  });
});
