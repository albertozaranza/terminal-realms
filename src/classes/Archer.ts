import type { CharacterClass, Skill, Stats } from "../types";

const preciseShot: Skill = {
  id: "precise_shot",
  name: "Disparo Preciso",
  description: "Causa 200% do dano com chance crítica aumentada. Cooldown de 4 turnos.",
  manaCost: 10,
  cooldown: 4,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "Arqueiro realiza um Disparo Preciso!",
  }),
};

const arrowRain: Skill = {
  id: "arrow_rain",
  name: "Chuva de Flechas",
  description: "Causa dano a todos os inimigos. Cooldown de 6 turnos.",
  manaCost: 15,
  cooldown: 6,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "Arqueiro dispara uma Chuva de Flechas!",
  }),
};

/**
 * Arqueiro — especialista em ataques à distância, críticos e velocidade.
 */
export class ArcherClass implements CharacterClass {
  readonly id = "archer";
  readonly name = "Arqueiro";

  getStartingStats(): Stats {
    return {
      maxHp: 90,
      maxMana: 50,
      strength: 9,
      dexterity: 16,
      intelligence: 8,
      defense: 4,
      speed: 10,
    };
  }

  getStartingSkills(): Skill[] {
    return [preciseShot, arrowRain];
  }
}
