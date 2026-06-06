import chalk from "chalk";
import type { Player } from "../../types";
import { t } from "../../utils";
import { renderBossArt, renderEnemyArt } from "../ansi";
import { center, coloredBar, divider, panel, renderHUD } from "../components";

/** Visão do inimigo para a tela de combate (somente leitura). */
export interface CombatEnemyView {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
}

/** Dados necessários para desenhar a tela de combate. */
export interface CombatScreenView {
  player: Player;
  enemy: CombatEnemyView;
  isBoss: boolean;
}

/**
 * Desenha a tela de combate: cabeçalho, arte do inimigo, barra de HP do
 * inimigo, divisória e o HUD do jogador. Chefes recebem arte maior e
 * destaque em vermelho.
 */
export function renderCombatScreen(view: CombatScreenView, width: number): string {
  const { enemy, isBoss } = view;

  const titleText = isBoss ? `☠  ${t("combat.bossTitle")}  ☠` : `⚔  ${t("combat.title")}  ⚔`;
  const header = panel(chalk.bold(isBoss ? chalk.red(titleText) : chalk.yellow(titleText)), {
    width,
    align: "center",
    borderColor: isBoss ? "red" : "yellow",
  });

  const art = isBoss ? renderBossArt(enemy.id) : renderEnemyArt(enemy.id);
  const paint = isBoss ? chalk.redBright : chalk.greenBright;
  const centeredArt = paint(center(art, width));

  const nameColor = isBoss ? chalk.red.bold : chalk.whiteBright.bold;
  const nameLine = center(`${nameColor(enemy.name)} ${chalk.gray(`Lv ${enemy.level}`)}`, width);
  const enemyBar = center(
    `${chalk.red("HP")} ${coloredBar(enemy.hp, enemy.maxHp, "hp", 28)} ${enemy.hp}/${enemy.maxHp}`,
    width,
  );

  const separator = chalk.dim(center(divider(Math.min(width, 60)), width));
  const playerPanel = panel(renderHUD(view.player), {
    title: t("combat.youTitle"),
    width,
    borderColor: "blue",
  });

  return [header, "", centeredArt, "", nameLine, enemyBar, "", separator, "", playerPanel].join(
    "\n",
  );
}
