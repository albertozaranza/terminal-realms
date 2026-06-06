import type { Entity } from "./Entity";

/**
 * Resultado da execução de uma habilidade.
 */
export interface SkillResult {
  damage: number;
  healing: number;
  message: string;
}

/**
 * Habilidade utilizável por uma entidade em combate.
 */
export interface Skill {
  id: string;
  name: string;
  description: string;

  manaCost: number;

  cooldown: number;

  execute(caster: Entity, target: Entity): SkillResult;
}
