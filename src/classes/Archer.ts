import type { CharacterClass, Skill, Stats } from "../types";

const preciseShot: Skill = {
  id: "precise_shot",
  name: "name.precise_shot",
  description: "desc.precise_shot",
  manaCost: 10,
  cooldown: 4,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "skillmsg.precise_shot",
  }),
};

const arrowRain: Skill = {
  id: "arrow_rain",
  name: "name.arrow_rain",
  description: "desc.arrow_rain",
  manaCost: 15,
  cooldown: 6,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "skillmsg.arrow_rain",
  }),
};

/**
 * Arqueiro — especialista em ataques à distância, críticos e velocidade.
 */
export class ArcherClass implements CharacterClass {
  readonly id = "archer";
  readonly name = "name.archer";

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
