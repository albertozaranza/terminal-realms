import type { GameState } from "./GameState";

/**
 * Fases do fluxo principal do jogo (ARCHITECTURE — Fluxo Principal).
 */
export type GamePhase = "menu" | "exploring" | "combat" | "gameover";

/** Dependências de inicialização da engine. */
export interface GameEngineOptions {
  state: GameState;
}

/**
 * Orquestra o fluxo principal do jogo.
 *
 * A engine NÃO realiza I/O diretamente: toda entrada e saída é
 * responsabilidade da camada de UI, que consome a engine. Isso mantém
 * a lógica do jogo testável sem interface.
 *
 * As transições entre fases (combate, exploração, etc.) serão acionadas
 * pelas engines/sistemas específicos nas tarefas seguintes.
 */
export class GameEngine {
  private state: GameState;
  private phase: GamePhase = "menu";
  private running = false;

  constructor(options: GameEngineOptions) {
    this.state = options.state;
  }

  /** Inicia a engine no menu principal. */
  start(): void {
    if (this.running) {
      throw new Error("GameEngine: a engine já foi iniciada.");
    }
    this.running = true;
    this.phase = "menu";
  }

  /** Encerra a engine. */
  stop(): void {
    this.running = false;
  }

  /** Transiciona para uma nova fase do jogo. */
  transitionTo(phase: GamePhase): void {
    if (!this.running) {
      throw new Error("GameEngine: não é possível trocar de fase com a engine parada.");
    }
    this.phase = phase;
  }

  isRunning(): boolean {
    return this.running;
  }

  getPhase(): GamePhase {
    return this.phase;
  }

  getState(): GameState {
    return this.state;
  }
}
