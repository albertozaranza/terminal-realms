import type { Skill } from "./Skill";
import type { Stats } from "./Stats";

/**
 * Contrato implementado por todas as classes jogáveis.
 *
 * A engine trabalha apenas com CharacterClass — nunca conhece
 * Guerreiro, Arqueiro ou Mago diretamente (ARCHITECTURE).
 */
export interface CharacterClass {
  id: string;
  name: string;
  getStartingStats(): Stats;
  getStartingSkills(): Skill[];
}
