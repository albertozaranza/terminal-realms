import chalk from "chalk";
import type { Location, LocationState, Region } from "../../types";
import { t } from "../../utils";

/**
 * Renderização do mapa da região como **árvore de descoberta** a partir da
 * entrada (├──/└──). Cada nó em sua própria linha — robusto com emojis de
 * largura variável. Mostra apenas o que foi descoberto; vizinhos ainda ocultos
 * aparecem como `❓` (mistério), e o mapa "cresce" conforme a exploração.
 *
 * A UI não calcula estados: recebe `displayStates` já derivados pelo loop
 * (via `getLocationState`).
 */
export interface MapView {
  region: Region;
  /** Estado de exibição por local (derivado em `discovery.getLocationState`). */
  displayStates: Record<string, LocationState>;
  /** Local onde o jogador está agora. */
  currentLocationId?: string;
}

/** Rótulo colorido de um nó conforme o estado e se é o local atual. */
function nodeLabel(location: Location, state: LocationState, isCurrent: boolean): string {
  const base = `${location.icon} ${t(location.name)}`;
  let label: string;
  switch (state) {
    case "completed":
      label = chalk.green(`${base} ✓`);
      break;
    case "locked":
      label = chalk.gray(`${base} 🔒`);
      break;
    case "available":
      label = chalk.cyan(base);
      break;
    default:
      label = chalk.white(base);
  }
  if (isCurrent) {
    label += chalk.yellow.bold(`  ◄ ${t("map.youAreHere")}`);
  }
  return label;
}

/** Desenha o mapa da região como árvore a partir do local de entrada. */
export function renderRegionMap(view: MapView): string {
  const { region, displayStates, currentLocationId } = view;
  const locations = region.locations ?? [];
  if (locations.length === 0) {
    return "";
  }
  const byId = new Map(locations.map((location) => [location.id, location]));
  const stateOf = (id: string): LocationState => displayStates[id] ?? "undiscovered";
  const lines: string[] = [];
  const visited = new Set<string>();

  const orderByCoord = (a: Location, b: Location): number =>
    a.coord.row - b.coord.row || a.coord.col - b.coord.col;

  function render(id: string, prefix: string, isLast: boolean, isRoot: boolean): void {
    const location = byId.get(id);
    if (!location) {
      return;
    }
    visited.add(id);
    const branch = isRoot ? "" : isLast ? "└── " : "├── ";
    lines.push(prefix + branch + nodeLabel(location, stateOf(id), id === currentLocationId));

    const childPrefix = prefix + (isRoot ? "" : isLast ? "    " : "│   ");
    const neighbors = location.connections
      .map((cid) => byId.get(cid))
      .filter((c): c is Location => c !== undefined && !visited.has(c.id))
      .sort(orderByCoord);

    const revealed = neighbors.filter((c) => stateOf(c.id) !== "undiscovered");
    const mysteries = neighbors.filter((c) => stateOf(c.id) === "undiscovered");
    // Reserva todos os filhos para que um nó não apareça sob dois pais.
    for (const child of [...revealed, ...mysteries]) {
      visited.add(child.id);
    }

    revealed.forEach((child, index) => {
      const last = index === revealed.length - 1 && mysteries.length === 0;
      render(child.id, childPrefix, last, false);
    });
    mysteries.forEach((_child, index) => {
      const last = index === mysteries.length - 1;
      lines.push(childPrefix + (last ? "└── " : "├── ") + chalk.gray(`❓ ${t("map.unknown")}`));
    });
  }

  const entry = region.entryLocationId ?? locations[0].id;
  render(entry, "", true, true);
  return lines.join("\n");
}

/** Legenda dos estados do mapa. */
export function renderMapLegend(): string {
  return [
    chalk.cyan(`⚔ ${t("map.legend.available")}`),
    chalk.green(`✓ ${t("map.legend.completed")}`),
    chalk.gray(`🔒 ${t("map.legend.locked")}`),
    chalk.gray(`❓ ${t("map.legend.unknown")}`),
  ].join("    ");
}
