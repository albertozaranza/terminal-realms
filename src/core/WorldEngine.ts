import type { Region } from "../types";
import { chance, pick, type Rng, t } from "../utils";

/** Encontro com um inimigo comum da região. */
export interface EnemyEncounter {
  type: "enemy";
  enemyId: string;
}

/** Encontro com um evento aleatório (baú, emboscada, mercador, ...). */
export interface EventEncounter {
  type: "event";
  eventId: string;
}

/** Resultado de avançar na exploração. */
export type Encounter = EnemyEncounter | EventEncounter;

/** Opções de configuração da exploração. */
export interface WorldEngineOptions {
  /** Ids de eventos que podem ocorrer na região. */
  eventPool?: readonly string[];
  /** Probabilidade (0 a 1) de um passo ser um evento. */
  eventChance?: number;
}

const DEFAULT_EVENT_CHANCE = 0.3;

/**
 * Engine de exploração de uma região.
 *
 * Retorna ids (string) de inimigos/eventos em vez de objetos para não
 * acoplar a camada core à camada de conteúdo — o chamador resolve o id.
 */
export class WorldEngine {
  private region: Region;
  private steps = 0;
  private readonly eventPool: readonly string[];
  private readonly eventChance: number;

  constructor(region: Region, options: WorldEngineOptions = {}) {
    this.region = region;
    this.eventPool = options.eventPool ?? [];
    this.eventChance = options.eventChance ?? DEFAULT_EVENT_CHANCE;
  }

  /** Avança um passo na região e retorna o encontro gerado. */
  advance(rng?: Rng): Encounter {
    if (this.region.enemyPool.length === 0) {
      throw new Error(t("error.world.noEnemies", { region: this.region.id }));
    }
    this.steps += 1;

    if (this.eventPool.length > 0 && chance(this.eventChance, rng)) {
      return { type: "event", eventId: pick(this.eventPool, rng) };
    }
    return { type: "enemy", enemyId: pick(this.region.enemyPool, rng) };
  }

  getSteps(): number {
    return this.steps;
  }

  getRegion(): Region {
    return this.region;
  }
}
