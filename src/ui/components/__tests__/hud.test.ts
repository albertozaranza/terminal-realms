import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../../classes";
import { createCharacter, grantExperience, MAX_LEVEL, xpToNextLevel } from "../../../core";
import { t } from "../../../utils";
import { renderBar, renderHUD } from "../hud";

const player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });

describe("renderBar", () => {
  it("is full when current = max", () => {
    expect(renderBar(10, 10, 10)).toBe(`[${"█".repeat(10)}]`);
  });

  it("is empty when current = 0", () => {
    expect(renderBar(0, 10, 10)).toBe(`[${"░".repeat(10)}]`);
  });

  it("fills half", () => {
    expect(renderBar(5, 10, 10)).toBe(`[${"█".repeat(5)}${"░".repeat(5)}]`);
  });

  it("handles max zero without breaking", () => {
    expect(renderBar(0, 0, 10)).toBe(`[${"░".repeat(10)}]`);
  });
});

describe("renderHUD", () => {
  it("shows the current level, HP, Mana and XP", () => {
    const hud = renderHUD(player);
    expect(hud).toContain(t("hud.level", { level: 1 }));
    expect(hud).toContain(`${player.hp}/${player.maxHp}`);
    expect(hud).toContain(`${player.mana}/${player.maxMana}`);
    expect(hud).toContain(`${player.experience}/${xpToNextLevel(1)}`);
  });

  it("reflects the updated state (real time)", () => {
    const damaged = { ...player, hp: 10 };
    expect(renderHUD(damaged)).toContain(`10/${player.maxHp}`);
  });

  it("shows max XP at the max level", () => {
    const maxed = grantExperience(player, 10_000_000).player;
    expect(maxed.level).toBe(MAX_LEVEL);
    expect(renderHUD(maxed)).toContain(t("hud.maxXp"));
  });
});
