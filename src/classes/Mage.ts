import type { CharacterClass, Skill, Stats } from "../types";

const bolaDeFogo: Skill = {
  id: "bola_de_fogo",
  name: "Bola de Fogo",
  description: "Causa dano mágico em área. Cooldown de 3 turnos.",
  manaCost: 15,
  cooldown: 3,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "Mago conjura uma Bola de Fogo!",
  }),
};

const raioArcano: Skill = {
  id: "raio_arcano",
  name: "Raio Arcano",
  description: "Causa dano mágico elevado em um único alvo. Cooldown de 2 turnos.",
  manaCost: 10,
  cooldown: 2,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "Mago dispara um Raio Arcano!",
  }),
};

const escudoArcano: Skill = {
  id: "escudo_arcano",
  name: "Escudo Arcano",
  description: "Reduz temporariamente o dano recebido. Cooldown de 4 turnos.",
  manaCost: 12,
  cooldown: 4,
  execute: () => ({
    damage: 0,
    healing: 0,
    message: "Mago ergue um Escudo Arcano!",
  }),
};

/**
 * Mago — especialista em dano mágico explosivo e controle.
 */
export class MageClass implements CharacterClass {
  readonly id = "mage";
  readonly name = "Mago";

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
    return [bolaDeFogo, raioArcano, escudoArcano];
  }
}
