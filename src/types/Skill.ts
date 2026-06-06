import type { Enemy } from "./Enemy";
import type { Player } from "./Player";

/**
 * Resultado da execução de uma habilidade.
 */
export interface SkillResult {
  damage: number;
  healing: number;
  message: string;

  /**
   * Bônus temporário de defesa concedido ao conjurador, como fração da
   * defesa base (ex.: 0.5 = +50%). Opcional — apenas habilidades
   * defensivas o utilizam.
   */
  defenseBuff?: number;

  /** Duração do bônus de defesa, em rodadas. */
  defenseBuffTurns?: number;
}

/**
 * Habilidade utilizável por uma entidade em combate.
 *
 * O conjurador é o jogador e o alvo é o inimigo: os tipos concretos
 * expõem os atributos necessários para calcular dano/cura sem acoplar a
 * habilidade à engine.
 */
export interface Skill {
  id: string;
  name: string;
  description: string;

  manaCost: number;

  cooldown: number;

  execute(caster: Player, target: Enemy): SkillResult;
}
