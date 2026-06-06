import { computeSkillDamage } from "../core/damage";
import type { CharacterClass, Skill, Stats } from "../types";

const fireball: Skill = {
  id: "fireball",
  name: "name.fireball",
  description: "desc.fireball",
  manaCost: 15,
  cooldown: 3,
  execute: (caster, target) => ({
    damage: computeSkillDamage(caster.intelligence, 1.8, target.defense),
    healing: 0,
    message: "skillmsg.fireball",
  }),
};

const arcaneBolt: Skill = {
  id: "arcane_bolt",
  name: "name.arcane_bolt",
  description: "desc.arcane_bolt",
  manaCost: 10,
  cooldown: 2,
  execute: (caster, target) => ({
    damage: computeSkillDamage(caster.intelligence, 2.2, target.defense),
    healing: 0,
    message: "skillmsg.arcane_bolt",
  }),
};

const arcaneShield: Skill = {
  id: "arcane_shield",
  name: "name.arcane_shield",
  description: "desc.arcane_shield",
  manaCost: 12,
  cooldown: 4,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "skillmsg.arcane_shield",
    defenseBuff: 0.5,
    defenseBuffTurns: 3,
  }),
};

/**
 * Mago — especialista em dano mágico explosivo e controle.
 */
export class MageClass implements CharacterClass {
  readonly id = "mage";
  readonly name = "name.mage";

  getStartingStats(): Stats {
    return {
      maxHp: 70,
      maxMana: 120,
      strength: 4,
      dexterity: 8,
      intelligence: 16,
      defense: 3,
      speed: 7,
    };
  }

  getStartingSkills(): Skill[] {
    return [fireball, arcaneBolt, arcaneShield];
  }
}
