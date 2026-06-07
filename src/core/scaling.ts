import type { Enemy } from "../types";

/**
 * Escalonamento leve de inimigos — a "alavanca barata" da abordagem híbrida
 * recomendada em `docs/PROGRESSAO.md`. Ajusta os stats de um inimigo-base para
 * um nível-alvo (normalmente o nível do jogador, limitado à faixa da região),
 * mantendo o desafio e as recompensas relevantes conforme o jogador evolui.
 *
 * Só escala para **cima**: alvos no nível-base ou abaixo retornam o inimigo
 * intacto — nunca trivializa um inimigo forte. Função pura: não muta o
 * template e retorna um novo `Enemy`.
 */

/** Crescimento por nível acima do base (fração somada por nível de diferença). */
export const ENEMY_GROWTH = {
  hp: 0.15,
  attack: 0.1,
  defense: 0.1,
  experienceReward: 0.5,
} as const;

/** Nível efetivo de um inimigo na região: nível do jogador, dentro da faixa. */
export function effectiveEnemyLevel(
  baseLevel: number,
  playerLevel: number,
  regionMaxLevel: number,
): number {
  return Math.min(Math.max(playerLevel, baseLevel), regionMaxLevel);
}

/** Escala os stats de um inimigo-base para o nível-alvo. */
export function scaleEnemy(base: Enemy, targetLevel: number): Enemy {
  const delta = targetLevel - base.level;
  if (delta <= 0) {
    return base;
  }
  const grow = (value: number, rate: number): number => Math.round(value * (1 + rate * delta));
  return {
    ...base,
    level: targetLevel,
    hp: grow(base.hp, ENEMY_GROWTH.hp),
    attack: grow(base.attack, ENEMY_GROWTH.attack),
    defense: grow(base.defense, ENEMY_GROWTH.defense),
    experienceReward: grow(base.experienceReward, ENEMY_GROWTH.experienceReward),
  };
}
