import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../classes";
import { createCharacter, grantExperience, MAX_LEVEL, xpToNextLevel } from "../../core";
import { renderBar, renderHUD } from "./hud";

const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });

describe("renderBar", () => {
  it("fica cheia quando current = max", () => {
    expect(renderBar(10, 10, 10)).toBe(`[${"█".repeat(10)}]`);
  });

  it("fica vazia quando current = 0", () => {
    expect(renderBar(0, 10, 10)).toBe(`[${"░".repeat(10)}]`);
  });

  it("preenche metade", () => {
    expect(renderBar(5, 10, 10)).toBe(`[${"█".repeat(5)}${"░".repeat(5)}]`);
  });

  it("trata max zero sem quebrar", () => {
    expect(renderBar(0, 0, 10)).toBe(`[${"░".repeat(10)}]`);
  });
});

describe("renderHUD", () => {
  it("mostra nível, HP, Mana e XP atuais", () => {
    const hud = renderHUD(player);
    expect(hud).toContain("Nível 1");
    expect(hud).toContain(`${player.hp}/${player.maxHp}`);
    expect(hud).toContain(`${player.mana}/${player.maxMana}`);
    expect(hud).toContain(`${player.experience}/${xpToNextLevel(1)}`);
  });

  it("reflete o estado atualizado (tempo real)", () => {
    const damaged = { ...player, hp: 10 };
    expect(renderHUD(damaged)).toContain(`10/${player.maxHp}`);
  });

  it("mostra XP máximo no nível máximo", () => {
    const maxed = grantExperience(player, 10_000_000).player;
    expect(maxed.level).toBe(MAX_LEVEL);
    expect(renderHUD(maxed)).toContain("MÁX");
  });
});
