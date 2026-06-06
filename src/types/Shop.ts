import type { Item } from "./Item";

/**
 * Oferta de uma loja: um item à venda, seu preço em ouro e o nível mínimo
 * do jogador para poder comprá-lo (gate de progressão).
 */
export interface ShopOffer {
  item: Item;
  price: number;
  requiredLevel: number;
}
