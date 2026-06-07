import { describe, expect, it } from "vitest";
import { t } from "../../utils";
import { renderWorldMapScreen } from "../screens";

describe("renderWorldMapScreen", () => {
  it("shows known regions and marks the current one", () => {
    const screen = renderWorldMapScreen(
      {
        regions: [{ id: "dark_woods", name: "name.dark_woods", icon: "🌲", current: true }],
        hasFrontier: true,
      },
      60,
    );
    expect(screen).toContain("🌲");
    expect(screen).toContain(t("name.dark_woods"));
    expect(screen).toContain("◄");
    // Fronteiras por descobrir aparecem como ❓.
    expect(screen).toContain("❓");
  });

  it("omits frontier markers when nothing is left to discover", () => {
    const screen = renderWorldMapScreen(
      {
        regions: [{ id: "dark_woods", name: "name.dark_woods", icon: "🌲", current: true }],
        hasFrontier: false,
      },
      60,
    );
    expect(screen).not.toContain("❓");
  });
});
