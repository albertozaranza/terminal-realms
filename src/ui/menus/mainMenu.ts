import inquirer from "inquirer";
import { t } from "../../utils";

/** Ações disponíveis no menu principal. */
export type MainMenuAction = "new" | "continue" | "exit";

/** Opção exibida no menu principal. O `name` é uma chave i18n. */
export interface MainMenuChoice {
  name: string;
  value: MainMenuAction;
}

/** Opções do menu principal (nomes são chaves i18n resolvidas via t()). */
export const MAIN_MENU_CHOICES: readonly MainMenuChoice[] = [
  { name: "menu.newGame", value: "new" },
  { name: "menu.continue", value: "continue" },
  { name: "menu.exit", value: "exit" },
];

/** Função que apresenta as opções e devolve a escolha do jogador. */
export type MainMenuPrompter = (choices: readonly MainMenuChoice[]) => Promise<MainMenuAction>;

const inquirerPrompter: MainMenuPrompter = async (choices) => {
  const { action } = await inquirer.prompt<{ action: MainMenuAction }>([
    {
      type: "list",
      name: "action",
      message: t("menu.title"),
      choices: choices.map((choice) => ({ name: t(choice.name), value: choice.value })),
    },
  ]);
  return action;
};

/**
 * Exibe o menu principal e retorna a ação escolhida. O prompter é
 * injetável para permitir testes sem interface interativa.
 */
export function showMainMenu(
  prompter: MainMenuPrompter = inquirerPrompter,
): Promise<MainMenuAction> {
  return prompter(MAIN_MENU_CHOICES);
}
