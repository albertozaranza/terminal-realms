import type { Entity } from "./Entity";

/** Estado atual de uma missão. */
export type QuestStatus = "active" | "completed" | "failed";

/**
 * Objetivo de uma missão de investigação. Concluído quando o conhecimento
 * associado é adquirido ou o local associado é concluído.
 */
export interface QuestObjective {
  id: string;
  /** Chave i18n do texto do objetivo. */
  description: string;
  /** Concluído ao adquirir este conhecimento. */
  knowledgeId?: string;
  /** Concluído ao concluir este local. */
  locationId?: string;
}

/**
 * Missão do jogo (principal ou secundária / de investigação).
 */
export interface Quest extends Entity {
  description: string;
  status: QuestStatus;
  /** Região à qual a missão pertence. */
  regionId?: string;
  /** Objetivos (missões de investigação). */
  objectives?: readonly QuestObjective[];
}
