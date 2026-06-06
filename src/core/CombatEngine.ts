import type { Enemy, Player } from "../types";

/** Situação atual do combate. */
export type CombatStatus = "ongoing" | "victory" | "defeat";

/**
 * Engine de combate por turnos entre o jogador e um inimigo.
 *
 * Opera sobre cópias internas dos combatentes para não mutar os dados
 * de origem (o inimigo costuma vir de um template de conteúdo). É
 * totalmente desacoplada da UI e testável sem interface.
 *
 * As ações de combate (ataque, habilidade, turnos, recompensas) são
 * adicionadas nas tarefas T012–T015.
 */
export class CombatEngine {
  protected readonly player: Player;
  protected readonly enemy: Enemy;
  protected status: CombatStatus = "ongoing";
  private started = false;

  constructor(player: Player, enemy: Enemy) {
    this.player = { ...player };
    this.enemy = { ...enemy };
  }

  /** Inicia o combate e avalia o estado inicial. */
  start(): void {
    if (this.started) {
      throw new Error("CombatEngine: o combate já foi iniciado.");
    }
    this.started = true;
    this.refreshStatus();
  }

  /** Reavalia o estado a partir do HP dos combatentes. */
  protected refreshStatus(): void {
    if (this.enemy.hp <= 0) {
      this.status = "victory";
    } else if (this.player.hp <= 0) {
      this.status = "defeat";
    } else {
      this.status = "ongoing";
    }
  }

  getStatus(): CombatStatus {
    return this.status;
  }

  /** Indica se o combate terminou (vitória ou derrota). */
  isOver(): boolean {
    return this.status !== "ongoing";
  }

  getPlayer(): Player {
    return this.player;
  }

  getEnemy(): Enemy {
    return this.enemy;
  }
}
