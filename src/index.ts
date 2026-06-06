/**
 * Terminal Realms — ponto de entrada.
 *
 * Provê a implementação real de GameIO (inquirer + console + ANSI art)
 * e executa o jogo. Toda a lógica de orquestração vive em game.ts.
 * Os textos da interface passam pelo i18n (t()).
 */
import inquirer from "inquirer";
import { type CombatChoice, type ExploreAction, type GameIO, runGame } from "./game";
import type { CharacterClass, Skill } from "./types";
import { renderLogo } from "./ui";
import { type Language, SUPPORTED_LANGUAGES, t } from "./utils";

const cliIO: GameIO = {
  render: (text) => {
    console.log(text);
  },

  mainMenu: async () => {
    console.log(renderLogo());
    const { action } = await inquirer.prompt<{
      action: "new" | "continue" | "language" | "exit";
    }>([
      {
        type: "list",
        name: "action",
        message: t("menu.title"),
        choices: [
          { name: t("menu.newGame"), value: "new" },
          { name: t("menu.continue"), value: "continue" },
          { name: t("menu.language"), value: "language" },
          { name: t("menu.exit"), value: "exit" },
        ],
      },
    ]);
    return action;
  },

  askName: async () => {
    const { name } = await inquirer.prompt<{ name: string }>([
      {
        type: "input",
        name: "name",
        message: t("prompt.characterName"),
        default: t("prompt.defaultName"),
      },
    ]);
    return name;
  },

  chooseClass: async (classes: readonly CharacterClass[]) => {
    const { id } = await inquirer.prompt<{ id: string }>([
      {
        type: "list",
        name: "id",
        message: t("prompt.chooseClass"),
        choices: classes.map((c) => ({ name: t(`name.${c.id}`), value: c.id })),
      },
    ]);
    return classes.find((c) => c.id === id) ?? classes[0];
  },

  chooseLanguage: async (current: Language) => {
    const { language } = await inquirer.prompt<{ language: Language }>([
      {
        type: "list",
        name: "language",
        message: t("prompt.chooseLanguage"),
        default: current,
        choices: SUPPORTED_LANGUAGES.map((lang) => ({ name: t(`language.${lang}`), value: lang })),
      },
    ]);
    return language;
  },

  exploreAction: async () => {
    const { action } = await inquirer.prompt<{ action: ExploreAction }>([
      {
        type: "list",
        name: "action",
        message: t("prompt.exploreAction"),
        choices: [
          { name: t("explore.explore"), value: "explore" },
          { name: t("explore.boss", { boss: t("name.goblin_king") }), value: "boss" },
          { name: t("explore.save"), value: "save" },
          { name: t("explore.menu"), value: "menu" },
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
        message: t("prompt.combatAction"),
        choices: [
          { name: t("combat.attack"), value: "attack" },
          ...skills.map((skill) => ({ name: skill.name, value: `skill:${skill.id}` })),
          { name: t("combat.flee"), value: "flee" },
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
