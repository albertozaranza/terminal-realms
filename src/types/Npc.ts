import type { Entity } from "./Entity";

/**
 * Personagem não-jogável: fonte de conhecimento e diálogos, não apenas
 * vendedor. Data-driven em content/.
 */
export interface NPC extends Entity {
  /** Ícone (emoji) no mapa/diálogo. */
  icon?: string;
  /** Chave i18n de personalidade/descrição curta. */
  personality?: string;
  /** Id do diálogo associado. */
  dialogueId: string;
}
