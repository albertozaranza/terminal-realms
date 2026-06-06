import inquirer from "inquirer";

/** Ações disponíveis no menu principal. */
export type MainMenuAction = "new" | "continue" | "exit";

/** Opção exibida no menu principal. */
export interface MainMenuChoice {
  name: string;
  value: MainMenuAction;
}

/** Opções do menu principal. */
export const MAIN_MENU_CHOICES: readonly MainMenuChoice[] = [
  { name: "Novo Jogo", value: "new" },
  { name: "Continuar", value: "continue" },
  { name: "Sair", value: "exit" },
];

/** Função que apresenta as opções e devolve a escolha do jogador. */
export type MainMenuPrompter = (choices: readonly MainMenuChoice[]) => Promise<MainMenuAction>;

const inquirerPrompter: MainMenuPrompter = async (choices) => {
  const { action } = await inquirer.prompt<{ action: MainMenuAction }>([
    {
      type: "list",
      name: "action",
      message: "Terminal Realms",
      choices: choices.map((choice) => ({ name: choice.name, value: choice.value })),
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
