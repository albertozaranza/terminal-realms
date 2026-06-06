import type { Entity } from "./Entity";

/** Estado atual de uma missão. */
export type QuestStatus = "active" | "completed" | "failed";

/**
 * Missão do jogo (principal ou secundária).
 */
export interface Quest extends Entity {
  description: string;
  status: QuestStatus;
}
