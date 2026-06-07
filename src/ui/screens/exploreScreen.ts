import chalk from "chalk";
import type { LocationState, Player, Region } from "../../types";
import { t } from "../../utils";
import { regionBand, regionTheme, renderMapLegend, renderRegionMap } from "../ansi";
import { panel, renderHUD } from "../components";

/** Dados necessários para desenhar a tela de exploração. */
export interface ExploreScreenView {
  player: Player;
  region: Region;
  gold: number;
  /** Quantidade de itens no inventário canônico (GameState.inventory). */
  itemCount: number;
  /** Verdadeiro quando a região é explorada como grafo de descoberta (FASE 16). */
  isGraph?: boolean;
  /** Estados de exibição por local — necessário para desenhar o mapa. */
  displayStates?: Record<string, LocationState>;
  /** Local onde o jogador está agora (modo grafo). */
  currentLocationId?: string;
}

/**
 * Desenha a tela de exploração: o mapa da região (modo grafo) ou a faixa
 * temática (modo linear), o HUD do jogador e um resumo de recursos.
 */
export function renderExploreScreen(view: ExploreScreenView, width: number): string {
  const { player, region, gold, itemCount, isGraph, displayStates, currentLocationId } = view;
  const theme = regionTheme(region.id);
  const regionName = t(region.name);

  // Modo grafo: o mapa fica sempre à vista no lugar do texto de exploração.
  const showMap = Boolean(isGraph && displayStates && (region.locations?.length ?? 0) > 0);
  const bannerBody = showMap
    ? `${renderRegionMap({ region, displayStates: displayStates ?? {}, currentLocationId })}\n\n${chalk.dim(
        renderMapLegend(),
      )}`
    : `${regionBand(region.id, 11)}\n\n${t("explore.flavor")}`;
  const banner = panel(bannerBody, {
    title: regionName,
    width,
    align: showMap ? "left" : "center",
    borderColor: theme.color,
  });

  const hud = panel(renderHUD(player), {
    title: t("hud.title"),
    width,
    borderColor: "blue",
  });

  const resources = panel(
    `${chalk.yellow(`◈ ${t("explore.gold", { gold })}`)}     ${chalk.cyan(
      `🎒 ${t("explore.items", { count: itemCount })}`,
    )}`,
    { width, borderColor: "yellow" },
  );

  return [banner, hud, resources].join("\n");
}
