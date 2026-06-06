import type { Knowledge } from "./Knowledge";
import type { Location } from "./Location";

/**
 * Região explorável do mundo. Definida de forma data-driven em content/.
 *
 * Regiões podem ser exploradas de forma **linear** (apenas `enemyPool`/`bossId`,
 * legado) ou como um **grafo de descoberta** (FASE 16): quando `locations` e
 * `entryLocationId` estão presentes, a exploração passa a ser por POIs.
 */
export interface Region {
  id: string;

  name: string;

  minLevel: number;

  maxLevel: number;

  enemyPool: string[];

  bossId: string;

  /** Id do local de entrada (regiões com grafo de descoberta). */
  entryLocationId?: string;

  /** Locais (POIs) que compõem o grafo da região. */
  locations?: readonly Location[];

  /** Conhecimentos descobríveis na região (para o diário). */
  knowledge?: readonly Knowledge[];
}
