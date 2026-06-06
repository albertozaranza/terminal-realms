import type { CharacterClass, Skill, Stats } from "../types";

const powerfulStrike: Skill = {
  id: "powerful_strike",
  name: "name.powerful_strike",
  description: "desc.powerful_strike",
  manaCost: 0,
  cooldown: 3,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "skillmsg.powerful_strike",
  }),
};

const defensiveStance: Skill = {
  id: "defensive_stance",
  name: "name.defensive_stance",
  description: "desc.defensive_stance",
  manaCost: 0,
  cooldown: 5,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "skillmsg.defensive_stance",
  }),
};

/**
 * Guerreiro — especialista em combate corpo a corpo, sobrevivência e defesa.
 */
export class WarriorClass implements CharacterClass {
  readonly id = "warrior";
  readonly name = "name.warrior";

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
