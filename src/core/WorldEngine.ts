import type { Region } from "../types";
import { pick, type Rng } from "../utils";

/** Encontro com um inimigo comum da região. */
export interface EnemyEncounter {
  type: "enemy";
  enemyId: string;
}

/** Resultado de avançar na exploração. Eventos são adicionados em T024. */
export type Encounter = EnemyEncounter;

/**
 * Engine de exploração de uma região.
 *
 * Retorna ids de inimigos (string) em vez de objetos Enemy para não
 * acoplar a camada core à camada de conteúdo — o chamador resolve o id.
 */
export class WorldEngine {
  private region: Region;
  private steps = 0;

  constructor(region: Region) {
    this.region = region;
  }

  /** Avança um passo na região e retorna o encontro gerado. */
  advance(rng?: Rng): Encounter {
    if (this.region.enemyPool.length === 0) {
      throw new Error(`WorldEngine: a região "${this.region.id}" não possui inimigos.`);
    }
    this.steps += 1;
    return { type: "enemy", enemyId: pick(this.region.enemyPool, rng) };
  }

  getSteps(): number {
    return this.steps;
  }

  getRegion(): Region {
    return this.region;
  }
}
