import type { GameState } from "./GameState";

/**
 * Resultado da execução de um evento. Os campos opcionais descrevem
 * efeitos que o orquestrador (game loop) aplica ao estado.
 */
export interface EventResult {
  message: string;
  /** Variação de ouro (positiva ou negativa). */
  goldChange?: number;
  /** Id de item concedido (ex.: baú). */
  itemId?: string;
  /** Id de inimigo para iniciar combate (ex.: emboscada). */
  startCombatWith?: string;
  /** Indica abertura de loja (ex.: mercador). */
  openShop?: boolean;
}

/**
 * Evento de jogo desacoplado (ARCHITECTURE). É executado sobre o estado
 * e devolve um EventResult descrevendo o que ocorreu.
 */
export interface GameEvent {
  id: string;
  title: string;
  execute(gameState: GameState): EventResult;
}
