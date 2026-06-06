import chalk from "chalk";
import { xpToNextLevel } from "../../core";
import type { Player } from "../../types";
import { clamp } from "../../utils";

/** Renderiza uma barra de progresso textual, ex.: [████░░░░░░]. */
export function renderBar(current: number, max: number, width = 20): string {
  const ratio = max <= 0 ? 0 : clamp(current / max, 0, 1);
  const filled = Math.round(ratio * width);
  return `[${"█".repeat(filled)}${"░".repeat(width - filled)}]`;
}

/**
 * Renderiza o HUD do jogador (Nível, HP, Mana, XP) como texto.
 *
 * É uma função pura: ao ser chamada com o Player atual, sempre reflete
 * o estado vigente — base para a atualização em tempo real pela tela.
 */
export function renderHUD(player: Player): string {
  const xpNeeded = xpToNextLevel(player.level);
  const xpText = Number.isFinite(xpNeeded) ? `${player.experience}/${xpNeeded}` : "MÁX";

  return [
    chalk.bold(`${player.name}  Nível ${player.level}`),
    `HP   ${chalk.red(renderBar(player.hp, player.maxHp))} ${player.hp}/${player.maxHp}`,
    `Mana ${chalk.blue(renderBar(player.mana, player.maxMana))} ${player.mana}/${player.maxMana}`,
    `XP   ${chalk.yellow(xpText)}`,
  ].join("\n");
}
