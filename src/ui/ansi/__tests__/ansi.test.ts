import { describe, expect, it } from "vitest";
import { renderBossArt, renderClassArt, renderLogo } from "../index";

describe("renderLogo", () => {
  it("produces non-empty multi-line art", () => {
    const logo = renderLogo();
    expect(logo.length).toBeGreaterThan(0);
    expect(logo.split("\n").length).toBeGreaterThan(1);
  });
});

describe("renderClassArt", () => {
  it.each(["warrior", "archer", "mage"])("has art for %s", (classId) => {
    expect(renderClassArt(classId).length).toBeGreaterThan(0);
  });

  it("throws for a class without art", () => {
    expect(() => renderClassArt("paladin")).toThrow();
  });
});

describe("renderBossArt", () => {
  it("has art for the Goblin King", () => {
    expect(renderBossArt("goblin_king").length).toBeGreaterThan(0);
  });

  it("throws for a boss without art", () => {
    expect(() => renderBossArt("dragon")).toThrow();
  });
});
