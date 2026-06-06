import chalk from "chalk";
import type { Player, Region } from "../../types";
import { t } from "../../utils";
import { regionBand, regionTheme } from "../ansi";
import { panel, renderHUD } from "../components";

/** Dados necessários para desenhar a tela de exploração. */
export interface ExploreScreenView {
  player: Player;
  region: Region;
  gold: number;
}

/**
 * Desenha a tela de exploração: faixa temática da região, HUD do jogador
 * e um resumo de recursos (ouro e itens).
 */
export function renderExploreScreen(view: ExploreScreenView, width: number): string {
  const { player, region, gold } = view;
  const theme = regionTheme(region.id);
  const regionName = t(region.name);

  const bannerBody = `${regionBand(region.id, 11)}\n\n${t("explore.flavor")}`;
  const banner = panel(bannerBody, {
    title: regionName,
    width,
    align: "center",
    borderColor: theme.color,
  });

  const hud = panel(renderHUD(player), {
    title: t("hud.title"),
    width,
    borderColor: "blue",
  });

  const resources = panel(
    `${chalk.yellow(`◈ ${t("explore.gold", { gold })}`)}     ${chalk.cyan(
      `🎒 ${t("explore.items", { count: player.inventory.length })}`,
    )}`,
    { width, borderColor: "yellow" },
  );

  return [banner, hud, resources].join("\n");
}
