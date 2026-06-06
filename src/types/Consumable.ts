import type { Item } from "./Item";

/** Efeito de um consumível (recuperação de recursos). */
export interface ConsumableEffect {
  hp?: number;
  mana?: number;
}

/** Item consumível (poções, etc.). */
export interface Consumable extends Item {
  effect: ConsumableEffect;
}
