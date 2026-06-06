import type { Item } from "../../types";
import { pocaoGrande, pocaoMana, pocaoMedia, pocaoPequena } from "./potions";
import { arcoSimples, cajadoCarvalho, espadaEnferrujada } from "./weapons";

export { pocaoGrande, pocaoMana, pocaoMedia, pocaoPequena } from "./potions";
export { arcoSimples, cajadoCarvalho, espadaEnferrujada } from "./weapons";

/** Registro de todos os itens por id. */
export const ITEMS: Readonly<Record<string, Item>> = {
  espada_enferrujada: espadaEnferrujada,
  arco_simples: arcoSimples,
  cajado_carvalho: cajadoCarvalho,
  pocao_pequena: pocaoPequena,
  pocao_media: pocaoMedia,
  pocao_grande: pocaoGrande,
  pocao_mana: pocaoMana,
};

/** Busca um item pelo id. Retorna undefined se não existir. */
export function findItemById(id: string): Item | undefined {
  return ITEMS[id];
}
