/**
 * Conjunto de atributos base de um personagem. Fornecido por uma
 * CharacterClass na criação do personagem.
 */
export interface Stats {
  maxHp: number;
  maxMana: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  defense: number;
  speed: number;
}
