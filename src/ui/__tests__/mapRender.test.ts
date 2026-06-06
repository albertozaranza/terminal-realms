import { describe, expect, it } from "vitest";
import { darkWoods } from "../../content";
import type { LocationState } from "../../types";
import { renderMapLegend, renderRegionMap } from "../ansi";

/** Estados de exibição de um cenário de exploração parcial. */
const states: Record<string, LocationState> = {
  village: "available",
  road: "available",
  hunter: "completed",
  merchant: "available",
  // woods/ruins/crypt/necromancer continuam ocultos.
};

describe("renderRegionMap", () => {
  it("renders the entry and its revealed neighbors", () => {
    const map = renderRegionMap({
      region: darkWoods,
      displayStates: states,
      currentLocationId: "village",
    });
    expect(map).toContain("🏰"); // vila (entrada)
    expect(map).toContain("🧙"); // caçador
    expect(map).toContain("💰"); // mercador
    expect(map).toContain("◄"); // marcador "você está aqui"
  });

  it("hides undiscovered locations behind a mystery marker", () => {
    const map = renderRegionMap({ region: darkWoods, displayStates: states });
    // Bosque ainda oculto: não aparece o ícone, mas há um ❓ (vizinho da estrada).
    expect(map).not.toContain("🌲");
    expect(map).toContain("❓");
  });

  it("marks a completed location and shows a locked one with a padlock", () => {
    const withCrypt: Record<string, LocationState> = {
      ...states,
      woods: "completed",
      ruins: "completed",
      crypt: "locked",
    };
    const map = renderRegionMap({ region: darkWoods, displayStates: withCrypt });
    expect(map).toContain("🪦"); // cripta revelada
    expect(map).toContain("🔒"); // cadeado (bloqueada)
  });

  it("renders an empty string for regions without a graph", () => {
    expect(
      renderRegionMap({ region: { ...darkWoods, locations: undefined }, displayStates: {} }),
    ).toBe("");
  });
});

describe("renderMapLegend", () => {
  it("includes the four state markers", () => {
    const legend = renderMapLegend();
    expect(legend).toContain("⚔");
    expect(legend).toContain("✓");
    expect(legend).toContain("🔒");
    expect(legend).toContain("❓");
  });
});
