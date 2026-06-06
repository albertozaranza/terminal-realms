import { describe, expect, it } from "vitest";
import { renderBossArt, renderClassArt, renderLogo } from "./index";

describe("renderLogo", () => {
  it("gera arte multilinha não vazia", () => {
    const logo = renderLogo();
    expect(logo.length).toBeGreaterThan(0);
    expect(logo.split("\n").length).toBeGreaterThan(1);
  });
});

describe("renderClassArt", () => {
  it.each(["warrior", "archer", "mage"])("tem arte para %s", (classId) => {
    expect(renderClassArt(classId).length).toBeGreaterThan(0);
  });

  it("lança erro para classe sem arte", () => {
    expect(() => renderClassArt("paladin")).toThrow();
  });
});

describe("renderBossArt", () => {
  it("tem arte para o Rei Goblin", () => {
    expect(renderBossArt("rei_goblin")).toContain("REI GOBLIN");
  });

  it("lança erro para chefe sem arte", () => {
    expect(() => renderBossArt("dragao")).toThrow();
  });
});
