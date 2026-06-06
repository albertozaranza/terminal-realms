import chalk from "chalk";
import type { GameState } from "../../core";
import { t } from "../../utils";
import { renderLogo } from "../ansi";
import { center, panel } from "../components";

/** Contexto compartilhado pelas telas de fim de jogo. */
export interface EndScreenContext {
  state: GameState;
  elapsed: string;
  /** Nome do chefe derrotado (apenas na tela de vitória). */
  bossName?: string;
}

function statsPanel(context: EndScreenContext, width: number, color: string): string {
  const { state } = context;
  const lines = [
    t("stats.level", { level: state.player.level }),
    t("stats.gold", { gold: state.inventory.gold }),
    t("stats.region", { region: t(state.currentRegion.name) }),
    t("stats.time", { time: context.elapsed }),
  ];
  if (context.bossName) {
    lines.unshift(t("stats.boss", { boss: context.bossName }));
  }
  return panel(lines.join("\n"), { title: t("stats.title"), width, borderColor: color });
}

/** Tela de vitória (chefe derrotado): sensação de conquista. */
export function renderVictoryScreen(context: EndScreenContext, width: number): string {
  const banner = chalk.yellowBright(center(renderLogo(t("victory.banner")), width));
  const subtitle = center(chalk.greenBright.bold(`🏆  ${t("victory.subtitle")}`), width);
  return [banner, "", subtitle, "", statsPanel(context, width, "green")].join("\n");
}

/** Tela de fim de jogo (derrota). */
export function renderGameOverScreen(context: EndScreenContext, width: number): string {
  const banner = chalk.redBright(center(renderLogo(t("gameover.banner")), width));
  const subtitle = center(chalk.red.bold(`☠  ${t("gameover.subtitle")}`), width);
  return [banner, "", subtitle, "", statsPanel(context, width, "red")].join("\n");
}
