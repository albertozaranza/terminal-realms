import type { Item } from "./Item";

/**
 * Uma pilha de itens no inventário: o item e quantas unidades dele.
 *
 * Itens empilháveis (consumíveis) agrupam-se em uma única pilha com
 * `quantity > 1`; equipamentos não empilham (uma pilha de quantidade 1 por
 * unidade), pois cada peça é tratada como instância individual.
 */
export interface InventorySlot {
  item: Item;
  quantity: number;
}

/** Inventário do jogador: pilhas de itens e quantidade de ouro. */
export interface Inventory {
  items: InventorySlot[];
  gold: number;
}
