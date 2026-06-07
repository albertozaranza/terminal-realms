import chalk from "chalk";
import { t } from "../../utils";
import { panel } from "../components";

/** Uma região conhecida no mapa-múndi. */
export interface WorldRegionView {
  id: string;
  /** Chave i18n do nome da região. */
  name: string;
  icon: string;
  /** Região onde o jogador está agora. */
  current?: boolean;
}

/** Dados para desenhar o mapa-múndi. */
export interface WorldMapScreenView {
  /** Apenas regiões descobertas. */
  regions: readonly WorldRegionView[];
  /** Há regiões ainda por descobrir (mostra fronteiras `❓`). */
  hasFrontier: boolean;
}

const CONNECTOR = "   ┊";

/**
 * Mapa-múndi: cadeia ramificada apenas das regiões conhecidas. Regiões
 * futuras nunca são reveladas antecipadamente — aparecem como `❓` nas
 * fronteiras. Só renderização.
 */
export function renderWorldMapScreen(view: WorldMapScreenView, width: number): string {
  const lines: string[] = [];

  if (view.hasFrontier) {
    lines.push(chalk.gray(`❓ ${t("world.unknown")}`), chalk.gray(CONNECTOR));
  }

  view.regions.forEach((region, index) => {
    const label = `${region.icon} ${t(region.name)}`;
    lines.push(region.current ? chalk.cyan.bold(`${label}  ◄ ${t("map.youAreHere")}`) : label);
    if (index < view.regions.length - 1) {
      lines.push(CONNECTOR);
    }
  });

  if (view.hasFrontier) {
    lines.push(chalk.gray(CONNECTOR), chalk.gray(`❓ ${t("world.unknown")}`));
  }

  return panel(lines.join("\n"), {
    title: t("world.title"),
    width,
    align: "center",
    borderColor: "cyan",
  });
}
