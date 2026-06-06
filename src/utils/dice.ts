/**
 * Rolagem de dados no estilo D&D.
 */
import { t } from "./i18n";
import { type Rng, randomInt } from "./random";

/** Rola um único dado de `sides` lados (1..sides). */
export function rollDie(sides: number, rng?: Rng): number {
  if (!Number.isInteger(sides) || sides < 1) {
    throw new Error(t("error.dice.invalidSides", { sides }));
  }
  return randomInt(1, sides, rng);
}

/** Rola `count` dados de `sides` lados e retorna a soma. */
export function rollDice(count: number, sides: number, rng?: Rng): number {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(t("error.dice.invalidCount", { count }));
  }
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += rollDie(sides, rng);
  }
  return total;
}

const NOTATION = /^(\d+)d(\d+)([+-]\d+)?$/i;

/**
 * Rola dados a partir da notação D&D, ex.: "2d6", "1d20", "3d4+2".
 */
export function roll(notation: string, rng?: Rng): number {
  const match = NOTATION.exec(notation.trim());
  if (!match) {
    throw new Error(t("error.dice.invalidNotation", { notation }));
  }
  const count = Number(match[1]);
  const sides = Number(match[2]);
  const modifier = match[3] ? Number(match[3]) : 0;
  return rollDice(count, sides, rng) + modifier;
}
