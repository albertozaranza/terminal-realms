import type { CharacterClass, Player } from "../types";
import { t } from "../utils";

/** Dados necessários para criar um personagem. */
export interface CreateCharacterInput {
  name: string;
  characterClass: CharacterClass;
}

/**
 * Cria um Player de nível 1 a partir do nome e da classe escolhidos.
 *
 * Os atributos vêm de `getStartingStats()` da classe — a função não
 * conhece classes concretas, apenas o contrato CharacterClass.
 */
export function createCharacter({ name, characterClass }: CreateCharacterInput): Player {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new Error(t("error.character.emptyName"));
  }

  const stats = characterClass.getStartingStats();

  return {
    id: "player",
    name: trimmedName,
    level: 1,
    experience: 0,
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    mana: stats.maxMana,
    maxMana: stats.maxMana,
    strength: stats.strength,
    dexterity: stats.dexterity,
    intelligence: stats.intelligence,
    defense: stats.defense,
    speed: stats.speed,
    classId: characterClass.id,
    inventory: [],
  };
}
