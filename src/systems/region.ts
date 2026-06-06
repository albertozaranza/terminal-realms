import type { Player, Region } from "../types";
import { t } from "../utils";

/**
 * Sistema de progressão entre regiões.
 *
 * Trabalha sobre uma lista ordenada de ids de região (ordem de
 * progressão), independente de quantas regiões existem.
 */

/** Indica se o jogador atende ao nível mínimo da região. */
export function canEnterRegion(player: Player, region: Region): boolean {
  return player.level >= region.minLevel;
}

/** Id da próxima região na ordem de progressão (undefined se for a última). */
export function getNextRegionId(order: readonly string[], currentId: string): string | undefined {
  const index = order.indexOf(currentId);
  if (index === -1) {
    throw new Error(t("error.region.notInOrder", { regionId: currentId }));
  }
  return order[index + 1];
}

/** Indica se a região é a última da progressão. */
export function isLastRegion(order: readonly string[], currentId: string): boolean {
  return getNextRegionId(order, currentId) === undefined;
}
