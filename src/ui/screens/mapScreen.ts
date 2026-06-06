import chalk from "chalk";
import type { Location } from "../../types";
import { t } from "../../utils";
import { type MapView, renderMapLegend, renderRegionMap } from "../ansi";
import { panel } from "../components";

/** Dados para desenhar a tela do mapa da região. */
export interface MapScreenView extends MapView {
  /** Local atual (para exibir nome/descrição abaixo do mapa). */
  current?: Location;
}

/**
 * Tela do mapa da região: o grafo de descoberta em árvore + legenda + um
 * resumo do local atual. Apenas renderização; a seleção de destino é feita
 * pela camada de IO.
 */
export function renderMapScreen(view: MapScreenView, width: number): string {
  const map = renderRegionMap(view);
  const legend = renderMapLegend();

  let footer = "";
  if (view.current) {
    const name = chalk.bold(`${view.current.icon} ${t(view.current.name)}`);
    const desc = view.current.description ? t(view.current.description) : "";
    footer = `\n\n${name}${desc ? `\n${chalk.gray(desc)}` : ""}`;
  }

  const body = `${map}\n\n${chalk.dim(legend)}${footer}`;
  return panel(body, {
    title: t(view.region.name),
    width,
    borderColor: "magenta",
  });
}
