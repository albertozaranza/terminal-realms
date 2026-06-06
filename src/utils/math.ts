/**
 * Utilitários matemáticos puros.
 */

/** Restringe um valor ao intervalo [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error(`clamp: min (${min}) não pode ser maior que max (${max}).`);
  }
  return Math.min(Math.max(value, min), max);
}

/** Soma uma lista de números. */
export function sum(values: readonly number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

/** Calcula uma porcentagem de um valor. Ex.: percentOf(50, 150) === 75. */
export function percentOf(value: number, percent: number): number {
  return (value * percent) / 100;
}
