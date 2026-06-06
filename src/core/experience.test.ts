import { describe, expect, it } from "vitest";
import { WarriorClass } from "../classes";
import { MAX_LEVEL } from "./config";
import { createCharacter } from "./createCharacter";
import { grantExperience, LEVEL_UP_GAINS, xpToNextLevel } from "./experience";

function newPlayer() {
  return createCharacter({ name: "Hero", characterClass: new WarriorClass() });
}

describe("xpToNextLevel", () => {
  it("é crescente com o nível", () => {
    expect(xpToNextLevel(2)).toBeGreaterThan(xpToNextLevel(1));
    expect(xpToNextLevel(10)).toBeGreaterThan(xpToNextLevel(5));
  });

  it("retorna Infinity no nível máximo", () => {
    expect(xpToNextLevel(MAX_LEVEL)).toBe(Number.POSITIVE_INFINITY);
  });

  it("lança erro para nível inválido", () => {
    expect(() => xpToNextLevel(0)).toThrow();
    expect(() => xpToNextLevel(1.5)).toThrow();
  });
});

describe("grantExperience", () => {
  it("acumula XP sem subir de nível", () => {
    const player = newPlayer();
    const result = grantExperience(player, xpToNextLevel(1) - 1);
    expect(result.leveledUp).toBe(false);
    expect(result.player.level).toBe(1);
  });

  it("sobe um nível e aplica ganhos de atributo", () => {
    const player = newPlayer();
    const result = grantExperience(player, xpToNextLevel(1));
    expect(result.leveledUp).toBe(true);
    expect(result.levelsGained).toBe(1);
    expect(result.player.level).toBe(2);
    expect(result.player.maxHp).toBe(player.maxHp + LEVEL_UP_GAINS.maxHp);
    expect(result.player.strength).toBe(player.strength + LEVEL_UP_GAINS.strength);
  });

  it("restaura hp e mana ao subir de nível", () => {
    const player = newPlayer();
    player.hp = 1;
    player.mana = 0;
    const result = grantExperience(player, xpToNextLevel(1));
    expect(result.player.hp).toBe(result.player.maxHp);
    expect(result.player.mana).toBe(result.player.maxMana);
  });

  it("processa múltiplos níveis de uma vez", () => {
    const player = newPlayer();
    const total = xpToNextLevel(1) + xpToNextLevel(2);
    const result = grantExperience(player, total);
    expect(result.player.level).toBe(3);
    expect(result.levelsGained).toBe(2);
  });

  it("não ultrapassa o nível máximo", () => {
    const player = newPlayer();
    const result = grantExperience(player, 10_000_000);
    expect(result.player.level).toBe(MAX_LEVEL);
  });

  it("não muta o jogador original", () => {
    const player = newPlayer();
    grantExperience(player, xpToNextLevel(1));
    expect(player.level).toBe(1);
  });

  it("lança erro para XP negativo", () => {
    expect(() => grantExperience(newPlayer(), -5)).toThrow();
  });
});
