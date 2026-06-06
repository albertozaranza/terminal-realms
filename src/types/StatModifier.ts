/** Atributos do jogador que um equipamento pode modificar. */
export type StatKey =
  | "maxHp"
  | "maxMana"
  | "strength"
  | "dexterity"
  | "intelligence"
  | "defense"
  | "speed";

/** Modificador de atributo aplicado por um equipamento. */
export interface StatModifier {
  stat: StatKey;
  value: number;
}
