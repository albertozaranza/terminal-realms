import { describe, expect, it } from "vitest";
import { darkWoods, investigateDarkWoods } from "../../content";
import type { LocationState } from "../../types";
import { t } from "../../utils";
import { renderJournalScreen } from "../screens";

describe("renderJournalScreen", () => {
  const locationStates: Record<string, LocationState> = { necromancer: "discovered" };

  it("lists known facts with a check mark and shows progress", () => {
    const screen = renderJournalScreen(
      {
        region: darkWoods,
        known: ["necromancer_seen", "crypt_entrance"],
        quest: investigateDarkWoods,
        locationStates,
      },
      72,
    );
    expect(screen).toContain("☑"); // fatos conhecidos
    expect(screen).toContain(t("knowledge.necromancer_seen"));
    expect(screen).toContain("(2/4)"); // progresso de conhecimento
  });

  it("marks pending objectives with an empty box", () => {
    const screen = renderJournalScreen(
      { region: darkWoods, known: [], quest: investigateDarkWoods, locationStates: {} },
      72,
    );
    // Nenhum objetivo concluído ainda → todos ☐.
    expect(screen).toContain("☐");
  });

  it("completes a knowledge objective once the fact is known", () => {
    const screen = renderJournalScreen(
      {
        region: darkWoods,
        known: ["necromancer_seen"],
        quest: investigateDarkWoods,
        locationStates: {},
      },
      72,
    );
    // O objetivo "learn necromancer" deve aparecer concluído (☑) junto aos fatos.
    expect(screen).toContain("☑");
    expect(screen).toContain(t("quest.investigate_dark_woods.obj.necromancer"));
  });
});
