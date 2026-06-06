import { describe, expect, it, vi } from "vitest";
import { MAIN_MENU_CHOICES, type MainMenuPrompter, showMainMenu } from "./mainMenu";

describe("menu principal", () => {
  it("oferece Novo Jogo, Continuar e Sair", () => {
    expect(MAIN_MENU_CHOICES.map((c) => c.value)).toEqual(["new", "continue", "exit"]);
  });

  it("toda opção tem rótulo", () => {
    for (const choice of MAIN_MENU_CHOICES) {
      expect(choice.name.length).toBeGreaterThan(0);
    }
  });

  it("retorna a ação escolhida pelo prompter", async () => {
    const prompter: MainMenuPrompter = vi.fn(async () => "new" as const);
    await expect(showMainMenu(prompter)).resolves.toBe("new");
    expect(prompter).toHaveBeenCalledWith(MAIN_MENU_CHOICES);
  });

  it("propaga a escolha de sair", async () => {
    const prompter: MainMenuPrompter = async () => "exit";
    await expect(showMainMenu(prompter)).resolves.toBe("exit");
  });
});
