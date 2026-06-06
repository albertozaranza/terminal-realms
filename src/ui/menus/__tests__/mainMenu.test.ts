import { describe, expect, it, vi } from "vitest";
import { MAIN_MENU_CHOICES, type MainMenuPrompter, showMainMenu } from "../mainMenu";

describe("main menu", () => {
  it("offers New Game, Continue and Exit", () => {
    expect(MAIN_MENU_CHOICES.map((c) => c.value)).toEqual(["new", "continue", "exit"]);
  });

  it("every option has a label key", () => {
    for (const choice of MAIN_MENU_CHOICES) {
      expect(choice.name.length).toBeGreaterThan(0);
    }
  });

  it("returns the action chosen by the prompter", async () => {
    const prompter: MainMenuPrompter = vi.fn(async () => "new" as const);
    await expect(showMainMenu(prompter)).resolves.toBe("new");
    expect(prompter).toHaveBeenCalledWith(MAIN_MENU_CHOICES);
  });

  it("propagates the exit choice", async () => {
    const prompter: MainMenuPrompter = async () => "exit";
    await expect(showMainMenu(prompter)).resolves.toBe("exit");
  });
});
