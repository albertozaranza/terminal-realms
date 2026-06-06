import type { CharacterClass, Skill, Stats } from "../types";

const powerfulStrike: Skill = {
  id: "powerful_strike",
  name: "Golpe Poderoso",
  description: "Causa 150% do dano em um alvo. Cooldown de 3 turnos.",
  manaCost: 0,
  cooldown: 3,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "Guerreiro desfere um Golpe Poderoso!",
  }),
};

const defensiveStance: Skill = {
  id: "defensive_stance",
  name: "Postura Defensiva",
  description: "Aumenta a defesa em 50% por 2 turnos. Cooldown de 5 turnos.",
  manaCost: 0,
  cooldown: 5,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "Guerreiro assume uma Postura Defensiva!",
  }),
};

/**
 * Guerreiro — especialista em combate corpo a corpo, sobrevivência e defesa.
 */
export class WarriorClass implements CharacterClass {
  readonly id = "warrior";
  readonly name = "Guerreiro";

  getStartingStats(): Stats {
    return {
      maxHp: 120,
      maxMana: 20,
      strength: 14,
      dexterity: 8,
      intelligence: 4,
      defense: 8,
      speed: 6,
    };
  }

  getStartingSkills(): Skill[] {
    return [powerfulStrike, defensiveStance];
  }
}
