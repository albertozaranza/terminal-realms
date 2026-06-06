/**
 * Terminal Realms — ponto de entrada.
 *
 * Provê a implementação real de GameIO (inquirer + console + ANSI art)
 * e executa o jogo. Toda a lógica de orquestração vive em game.ts.
 */
import inquirer from "inquirer";
import { type CombatChoice, type ExploreAction, type GameIO, runGame } from "./game";
import type { CharacterClass, Skill } from "./types";
import { renderLogo } from "./ui";

const cliIO: GameIO = {
  render: (text) => {
    console.log(text);
  },

  mainMenu: async () => {
    console.log(renderLogo());
    const { action } = await inquirer.prompt<{ action: "new" | "continue" | "exit" }>([
      {
        type: "list",
        name: "action",
        message: "Terminal Realms",
        choices: [
          { name: "Novo Jogo", value: "new" },
          { name: "Continuar", value: "continue" },
          { name: "Sair", value: "exit" },
        ],
      },
    ]);
    return action;
  },

  askName: async () => {
    const { name } = await inquirer.prompt<{ name: string }>([
      { type: "input", name: "name", message: "Nome do personagem:", default: "Herói" },
    ]);
    return name;
  },

  chooseClass: async (classes: readonly CharacterClass[]) => {
    const { id } = await inquirer.prompt<{ id: string }>([
      {
        type: "list",
        name: "id",
        message: "Escolha sua classe:",
        choices: classes.map((c) => ({ name: c.name, value: c.id })),
      },
    ]);
    return classes.find((c) => c.id === id) ?? classes[0];
  },

  exploreAction: async () => {
    const { action } = await inquirer.prompt<{ action: ExploreAction }>([
      {
        type: "list",
        name: "action",
        message: "O que deseja fazer?",
        choices: [
          { name: "Explorar", value: "explore" },
          { name: "Enfrentar o Rei Goblin", value: "boss" },
          { name: "Salvar", value: "save" },
          { name: "Voltar ao menu", value: "menu" },
        ],
      },
    ]);
    return action;
  },

  combatAction: async (skills: readonly Skill[]) => {
    const { action } = await inquirer.prompt<{ action: string }>([
      {
        type: "list",
        name: "action",
        message: "Sua ação:",
        choices: [
          { name: "Atacar", value: "attack" },
          ...skills.map((skill) => ({ name: skill.name, value: `skill:${skill.id}` })),
          { name: "Fugir", value: "flee" },
        ],
      },
    ]);
    if (action === "attack" || action === "flee") {
      return action as CombatChoice;
    }
    const skillId = action.replace("skill:", "");
    const skill = skills.find((s) => s.id === skillId);
    return skill ? { type: "skill", skill } : "attack";
  },
};

runGame(cliIO).catch((error: unknown) => {
  console.error("Erro fatal:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
