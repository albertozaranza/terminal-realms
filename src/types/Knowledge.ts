/**
 * Fato/segredo descoberto pelo jogador. Compõe o diário da região e pode
 * destravar locais, opções de diálogo e chefes (gate por conhecimento).
 */
export interface Knowledge {
  id: string;
  /** Chave i18n do texto do fato. */
  text: string;
  /** Região à qual o fato pertence. */
  regionId: string;
}
