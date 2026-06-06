import type { Item } from "./Item";

/** Inventário do jogador: itens carregados e quantidade de ouro. */
export interface Inventory {
  items: Item[];
  gold: number;
}
