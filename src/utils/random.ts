/**
 * Utilitários de aleatoriedade.
 *
 * Todas as funções aceitam um gerador `rng` opcional (padrão Math.random)
 * para permitir testes determinísticos.
 */

import { t } from "./i18n";

/** Gerador de números pseudoaleatórios no intervalo [0, 1). */
export type Rng = () => number;

const defaultRng: Rng = Math.random;

/** Inteiro aleatório entre `min` e `max`, inclusive em ambos. */
export function randomInt(min: number, max: number, rng: Rng = defaultRng): number {
  if (min > max) {
    throw new Error(t("error.common.minGreaterThanMax", { min, max }));
  }
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Float aleatório no intervalo [min, max). */
export function randomFloat(min: number, max: number, rng: Rng = defaultRng): number {
  if (min > max) {
    throw new Error(t("error.common.minGreaterThanMax", { min, max }));
  }
  return rng() * (max - min) + min;
}

/** Retorna `true` com a probabilidade informada (0 a 1). */
export function chance(probability: number, rng: Rng = defaultRng): boolean {
  if (probability < 0 || probability > 1) {
    throw new Error(t("error.random.invalidProbability", { probability }));
  }
  return rng() < probability;
}

/** Escolhe um elemento aleatório de um array não vazio. */
export function pick<T>(items: readonly T[], rng: Rng = defaultRng): T {
  if (items.length === 0) {
    throw new Error(t("error.random.emptyArray"));
  }
  return items[randomInt(0, items.length - 1, rng)];
}

/** Entrada de uma escolha ponderada. */
export interface WeightedEntry<T> {
  item: T;
  weight: number;
}

/**
 * Escolhe um item com base em pesos. Os pesos devem ser não-negativos e
 * a soma deve ser maior que zero.
 */
export function weightedPick<T>(entries: readonly WeightedEntry<T>[], rng: Rng = defaultRng): T {
  if (entries.length === 0) {
    throw new Error(t("error.random.emptyEntries"));
  }

  let total = 0;
  for (const entry of entries) {
    if (entry.weight < 0) {
      throw new Error(t("error.random.negativeWeight", { weight: entry.weight }));
    }
    total += entry.weight;
  }

  if (total <= 0) {
    throw new Error(t("error.random.nonPositiveWeightSum"));
  }

  let roll = rng() * total;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll < 0) {
      return entry.item;
    }
  }

  // Borda por imprecisão de ponto flutuante: retorna o último item.
  return entries[entries.length - 1].item;
}
