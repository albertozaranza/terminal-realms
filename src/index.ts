/**
 * Terminal Realms — ponto de entrada.
 *
 * Provê a implementação real de GameIO usando um GameRenderer de tela
 * cheia (inquirer para entrada + ANSI art). A interface é redesenhada a
 * cada mudança de estado, em vez de acumular linhas: a cena atual e um
 * painel de histórico são compostos pelo renderer; a UI nunca escreve
 * diretamente no terminal. Toda a orquestração vive em game.ts e os
 * textos passam pelo i18n (t()).
 */
import inquirer from "inquirer";
import {
  type CombatChoice,
  type CombatContext,
  type CombatSkillOption,
  type EndContext,
  type ExploreAction,
  type ExploreContext,
  type GameIO,
  runGame,
} from "./game";
import type { CharacterClass } from "./types";
import {
  GameRenderer,
  renderClassGallery,
  renderCombatScreen,
  renderCreationIntro,
  renderExploreScreen,
  renderGameOverScreen,
  renderLanguageScreen,
  renderMenuScreen,
  renderVictoryScreen,
} from "./ui";
import { type Language, SUPPORTED_LANGUAGES, t } from "./utils";

const renderer = new GameRenderer();

/** Aguarda o jogador pressionar Enter (telas terminais). */
async function pressEnter(): Promise<void> {
  await inquirer.prompt([{ type: "input", name: "_", message: t("prompt.continue") }]);
}

const cliIO: GameIO = {
  render: (text) => {
    renderer.pushLog(text);
    renderer.paint();
  },

  mainMenu: async () => {
    renderer.resetLog();
    renderer.paint(renderMenuScreen(renderer.width));
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
    renderer.paint(renderCreationIntro(renderer.width));
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
    renderer.paint(renderClassGallery(classes, renderer.width));
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
    renderer.paint(renderLanguageScreen(renderer.width));
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

  exploreAction: async (context: ExploreContext) => {
    renderer.paint(renderExploreScreen(context, renderer.width));
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

  combatAction: async (context: CombatContext, options: readonly CombatSkillOption[]) => {
    renderer.paint(renderCombatScreen(context, renderer.width));
    const { action } = await inquirer.prompt<{ action: string }>([
      {
        type: "list",
        name: "action",
        message: t("prompt.combatAction"),
        choices: [
          { name: t("combat.attack"), value: "attack" },
          ...options.map(({ skill, cooldown }) => ({
            name: t(skill.name),
            value: `skill:${skill.id}`,
            disabled: cooldown > 0 ? t("combat.cooldown", { turns: cooldown }) : false,
          })),
          { name: t("combat.flee"), value: "flee" },
        ],
      },
    ]);
    if (action === "attack" || action === "flee") {
      return action as CombatChoice;
    }
    const skillId = action.replace("skill:", "");
    const skill = options.find((o) => o.skill.id === skillId)?.skill;
    return skill ? { type: "skill", skill } : "attack";
  },

  victory: async (context: EndContext) => {
    renderer.paintRaw(
      renderVictoryScreen({ ...context, elapsed: renderer.elapsed() }, renderer.width),
    );
    await pressEnter();
  },

  gameOver: async (context: EndContext) => {
    renderer.paintRaw(
      renderGameOverScreen({ ...context, elapsed: renderer.elapsed() }, renderer.width),
    );
    await pressEnter();
  },
};

runGame(cliIO).catch((error: unknown) => {
  console.error("Erro fatal:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
