import type { Enemy, Player } from "../types";
import { computeDamage, getPlayerAttack } from "./damage";

/** Situação atual do combate. */
export type CombatStatus = "ongoing" | "victory" | "defeat";

/** Combatente que age no turno atual. */
export type Combatant = "player" | "enemy";

/** Resultado de uma ação de ataque. */
export interface AttackOutcome {
  damage: number;
  targetHpRemaining: number;
}

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
  protected currentTurn: Combatant = "player";
  protected round = 1;
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
    this.currentTurn = "player";
    this.round = 1;
    this.refreshStatus();
  }

  getCurrentTurn(): Combatant {
    return this.currentTurn;
  }

  getRound(): number {
    return this.round;
  }

  /**
   * Encerra o turno atual e passa a vez. Ao voltar para o jogador,
   * uma nova rodada começa.
   */
  endTurn(): void {
    this.ensureActable();
    if (this.currentTurn === "player") {
      this.currentTurn = "enemy";
    } else {
      this.currentTurn = "player";
      this.round += 1;
    }
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

  /** Garante que uma ação pode ser executada. */
  protected ensureActable(): void {
    if (!this.started) {
      throw new Error("CombatEngine: o combate não foi iniciado.");
    }
    if (this.isOver()) {
      throw new Error("CombatEngine: o combate já foi encerrado.");
    }
  }

  /** Ataque básico do jogador contra o inimigo. */
  playerAttack(): AttackOutcome {
    this.ensureActable();
    const damage = computeDamage(getPlayerAttack(this.player), this.enemy.defense);
    this.enemy.hp = Math.max(0, this.enemy.hp - damage);
    this.refreshStatus();
    return { damage, targetHpRemaining: this.enemy.hp };
  }

  /** Ataque básico do inimigo contra o jogador. */
  enemyAttack(): AttackOutcome {
    this.ensureActable();
    const damage = computeDamage(this.enemy.attack, this.player.defense);
    this.player.hp = Math.max(0, this.player.hp - damage);
    this.refreshStatus();
    return { damage, targetHpRemaining: this.player.hp };
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
