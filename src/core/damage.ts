import type { Player } from "../types";
import { MIN_DAMAGE } from "./config";

/**
 * Fórmula de dano (ARCHITECTURE): attack - defense / 2, arredondado para
 * baixo, com um mínimo de MIN_DAMAGE.
 */
export function computeDamage(attack: number, defense: number): number {
  return Math.max(MIN_DAMAGE, Math.floor(attack - defense / 2));
}

/**
 * Poder de ataque do jogador: o maior entre força, destreza e
 * inteligência — naturalmente o atributo principal da classe, sem
 * acoplar o combate às classes concretas.
 */
export function getPlayerAttack(player: Player): number {
  return Math.max(player.strength, player.dexterity, player.intelligence);
}

/**
 * Dano de uma habilidade: escala um atributo do conjurador por um
 * multiplicador (ex.: 1.5 = 150% do atributo) e aplica a fórmula de dano
 * padrão contra a defesa do alvo.
 */
export function computeSkillDamage(attribute: number, multiplier: number, defense: number): number {
  return computeDamage(attribute * multiplier, defense);
}
