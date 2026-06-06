import type { Enemy, Player, Skill, SkillResult } from "../types";
import { t } from "../utils";
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

/** Resultado do uso de uma habilidade. */
export interface SkillUseOutcome {
  result: SkillResult;
  manaSpent: number;
}

/** Resultado final do combate. */
export interface CombatResult {
  status: "victory" | "defeat";
  /** XP concedido ao jogador (0 em derrota). */
  experienceReward: number;
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
  /** Cooldowns restantes (em rodadas) por id de habilidade. */
  private readonly cooldowns = new Map<string, number>();
  /** Bônus de defesa ativo do jogador (fração da defesa base). */
  private defenseBuff = 0;
  /** Rodadas restantes do bônus de defesa. */
  private defenseBuffTurns = 0;

  constructor(player: Player, enemy: Enemy) {
    this.player = { ...player };
    this.enemy = { ...enemy };
  }

  /** Inicia o combate e avalia o estado inicial. */
  start(): void {
    if (this.started) {
      throw new Error(t("error.combat.alreadyStarted"));
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
      this.tickCooldowns();
    }
  }

  /** Cooldown restante (em rodadas) de uma habilidade. */
  getSkillCooldown(skillId: string): number {
    return this.cooldowns.get(skillId) ?? 0;
  }

  isOnCooldown(skillId: string): boolean {
    return this.getSkillCooldown(skillId) > 0;
  }

  /** Reduz em 1 o cooldown de todas as habilidades (mínimo 0). */
  private tickCooldowns(): void {
    for (const [skillId, remaining] of this.cooldowns) {
      if (remaining <= 1) {
        this.cooldowns.delete(skillId);
      } else {
        this.cooldowns.set(skillId, remaining - 1);
      }
    }
    if (this.defenseBuffTurns > 0) {
      this.defenseBuffTurns -= 1;
      if (this.defenseBuffTurns === 0) {
        this.defenseBuff = 0;
      }
    }
  }

  /**
   * Defesa efetiva do jogador, incluindo o bônus temporário concedido
   * por habilidades defensivas (arredondado para baixo).
   */
  protected effectivePlayerDefense(): number {
    return Math.floor(this.player.defense * (1 + this.defenseBuff));
  }

  /**
   * Usa uma habilidade do jogador: valida cooldown e mana, consome a
   * mana, aplica o efeito (dano/cura) e registra o cooldown.
   */
  useSkill(skill: Skill): SkillUseOutcome {
    this.ensureActable();
    if (this.isOnCooldown(skill.id)) {
      throw new Error(t("error.combat.skillOnCooldown", { name: t(skill.name) }));
    }
    if (this.player.mana < skill.manaCost) {
      throw new Error(t("error.combat.notEnoughMana", { name: t(skill.name) }));
    }

    this.player.mana -= skill.manaCost;
    const result = skill.execute(this.player, this.enemy);

    if (result.damage > 0) {
      this.enemy.hp = Math.max(0, this.enemy.hp - result.damage);
    }
    if (result.healing > 0) {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + result.healing);
    }
    if (result.defenseBuff && result.defenseBuffTurns && result.defenseBuffTurns > 0) {
      this.defenseBuff = result.defenseBuff;
      this.defenseBuffTurns = result.defenseBuffTurns;
    }

    if (skill.cooldown > 0) {
      this.cooldowns.set(skill.id, skill.cooldown);
    }
    this.refreshStatus();

    return { result, manaSpent: skill.manaCost };
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
      throw new Error(t("error.combat.notStarted"));
    }
    if (this.isOver()) {
      throw new Error(t("error.combat.alreadyEnded"));
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
    const damage = computeDamage(this.enemy.attack, this.effectivePlayerDefense());
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

  /**
   * Resultado final do combate. Só pode ser obtido após o término.
   * Recompensas de gold e loot são adicionadas na Fase 5 (loot).
   */
  getResult(): CombatResult {
    if (!this.isOver()) {
      throw new Error(t("error.combat.stillOngoing"));
    }
    if (this.status === "victory") {
      return { status: "victory", experienceReward: this.enemy.experienceReward };
    }
    return { status: "defeat", experienceReward: 0 };
  }

  getPlayer(): Player {
    return this.player;
  }

  getEnemy(): Enemy {
    return this.enemy;
  }
}
