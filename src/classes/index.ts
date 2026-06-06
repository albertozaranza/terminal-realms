// Camada Classes — classes jogáveis, cada uma implementando CharacterClass.
import type { CharacterClass } from "../types";
import { ArcherClass } from "./Archer";
import { MageClass } from "./Mage";
import { WarriorClass } from "./Warrior";

export { ArcherClass } from "./Archer";
export { MageClass } from "./Mage";
export { WarriorClass } from "./Warrior";

/** Classes jogáveis disponíveis para seleção na criação de personagem. */
export const AVAILABLE_CLASSES: readonly CharacterClass[] = [
  new WarriorClass(),
  new ArcherClass(),
  new MageClass(),
];

/** Busca uma classe jogável pelo seu id. Retorna undefined se não existir. */
export function findClassById(id: string): CharacterClass | undefined {
  return AVAILABLE_CLASSES.find((characterClass) => characterClass.id === id);
}
