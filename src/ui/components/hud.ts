import chalk from "chalk";
import { xpToNextLevel } from "../../core";
import type { Player } from "../../types";
import { clamp, t } from "../../utils";

/** Tipo de recurso representado por uma barra (define a cor). */
export type BarKind = "hp" | "mana" | "xp";

/** Renderiza uma barra de progresso textual, ex.: [████░░░░░░]. */
export function renderBar(current: number, max: number, width = 20): string {
  const ratio = max <= 0 ? 0 : clamp(current / max, 0, 1);
  const filled = Math.round(ratio * width);
  return `[${"█".repeat(filled)}${"░".repeat(width - filled)}]`;
}

/**
 * Renderiza uma barra colorida conforme o recurso. HP muda de verde →
 * amarelo → vermelho conforme cai; Mana é azul; XP é magenta.
 */
export function coloredBar(current: number, max: number, kind: BarKind, width = 20): string {
  const bar = renderBar(current, max, width);
  if (kind === "mana") {
    return chalk.blueBright(bar);
  }
  if (kind === "xp") {
    return chalk.magenta(bar);
  }
  const ratio = max <= 0 ? 0 : clamp(current / max, 0, 1);
  if (ratio > 0.5) {
    return chalk.green(bar);
  }
  if (ratio > 0.25) {
    return chalk.yellow(bar);
  }
  return chalk.red(bar);
}

/**
 * Renderiza o HUD do jogador (Nível, HP, Mana, XP) como texto.
 *
 * É uma função pura: ao ser chamada com o Player atual, sempre reflete
 * o estado vigente — base para a atualização em tempo real pela tela.
 */
export function renderHUD(player: Player): string {
  const xpNeeded = xpToNextLevel(player.level);
  const maxed = !Number.isFinite(xpNeeded);
  const xpBar = maxed ? coloredBar(1, 1, "xp") : coloredBar(player.experience, xpNeeded, "xp");
  const xpText = maxed ? t("hud.maxXp") : `${player.experience}/${xpNeeded}`;

  return [
    chalk.bold(`${player.name}  ${chalk.gray(t("hud.level", { level: player.level }))}`),
    `${chalk.red("HP")}   ${coloredBar(player.hp, player.maxHp, "hp")} ${player.hp}/${player.maxHp}`,
    `${chalk.blue("MP")}   ${coloredBar(player.mana, player.maxMana, "mana")} ${player.mana}/${player.maxMana}`,
    `${chalk.magenta("XP")}   ${xpBar} ${xpText}`,
  ].join("\n");
}
