import { AVAILABLE_CLASSES } from "./classes";
import {
  findEnemyById,
  findEventById,
  findItemById,
  findLootTable,
  goblinKing,
  startingFields,
} from "./content";
import {
  applyVictoryRewards,
  CombatEngine,
  createCharacter,
  createInitialGameState,
  type GameState,
} from "./core";
import { hasSave, loadGame, rollLoot, type SaveOptions, saveGame } from "./systems";
import type { CharacterClass, Enemy, Item, Skill } from "./types";
import { renderHUD } from "./ui";
import { getLanguage, type Language, type Rng, randomInt, setLanguage, t } from "./utils";

/** Nome localizado de uma entidade pelo seu id (fallback para o id). */
function localizedName(id: string): string {
  return t(`name.${id}`);
}

/** Ação escolhida no menu de exploração. */
export type ExploreAction = "explore" | "boss" | "save" | "menu";

/** Escolha do jogador durante um turno de combate. */
export type CombatChoice = "attack" | "flee" | { type: "skill"; skill: Skill };

/** Resultado de um combate na sessão. */
export type CombatOutcome = "victory" | "defeat" | "fled";

/**
 * Porta de entrada/saída do jogo. A camada de UI (ou um script de
 * teste) implementa esta interface; a orquestração não toca em I/O
 * diretamente, mantendo o fluxo testável.
 */
export interface GameIO {
  render(text: string): void | Promise<void>;
  mainMenu(): Promise<"new" | "continue" | "language" | "exit">;
  askName(): Promise<string>;
  chooseClass(classes: readonly CharacterClass[]): Promise<CharacterClass>;
  chooseLanguage(current: Language): Promise<Language>;
  exploreAction(): Promise<ExploreAction>;
  combatAction(skills: readonly Skill[]): Promise<CombatChoice>;
}

/** Opções de execução do jogo (storage de save e fonte de aleatoriedade). */
export interface RunGameOptions extends SaveOptions {
  rng?: Rng;
}

/** Probabilidade de um passo de exploração ser um evento. */
const EVENT_CHANCE = 0.2;

/** Resolve as recompensas de uma vitória (loot + ouro) e aplica ao estado. */
function rewardVictory(
  state: GameState,
  enemy: Enemy,
  experienceReward: number,
  rng?: Rng,
): { state: GameState; leveledUp: boolean } {
  const table = findLootTable(enemy.lootTableId);
  const loot: Item[] = [];
  if (table) {
    const item = findItemById(rollLoot(table, rng));
    if (item) {
      loot.push(item);
    }
  }
  const { state: next, leveledUp } = applyVictoryRewards(state, {
    experience: experienceReward,
    loot,
    gold: randomInt(5, 100, rng),
  });
  return { state: next, leveledUp };
}

/** Resolve um combate completo de forma interativa via a porta de IO. */
async function resolveCombat(
  io: GameIO,
  state: GameState,
  enemy: Enemy,
  rng?: Rng,
): Promise<{ state: GameState; outcome: CombatOutcome }> {
  const combat = new CombatEngine(state.player, enemy);
  combat.start();
  const skills =
    AVAILABLE_CLASSES.find((c) => c.id === state.player.classId)?.getStartingSkills() ?? [];

  const enemyName = localizedName(enemy.id);
  await io.render(t("combat.appeared", { name: enemyName }));

  while (!combat.isOver()) {
    await io.render(
      `${renderHUD(combat.getPlayer())}\n${t("combat.enemyHp", { name: enemyName, hp: combat.getEnemy().hp })}`,
    );
    const choice = await io.combatAction(skills);

    if (choice === "flee") {
      return { state, outcome: "fled" };
    }
    if (choice === "attack") {
      const hit = combat.playerAttack();
      await io.render(t("combat.playerHit", { damage: hit.damage }));
    } else {
      await io.render(combat.useSkill(choice.skill).result.message);
    }

    if (combat.isOver()) {
      break;
    }
    combat.endTurn();
    const enemyHit = combat.enemyAttack();
    await io.render(t("combat.enemyHit", { name: enemyName, damage: enemyHit.damage }));
    if (combat.isOver()) {
      break;
    }
    combat.endTurn();
  }

  const result = combat.getResult();
  const synced: GameState = { ...state, player: combat.getPlayer() };

  if (result.status === "defeat") {
    return { state: synced, outcome: "defeat" };
  }

  const { state: rewarded, leveledUp } = rewardVictory(synced, enemy, result.experienceReward, rng);
  await io.render(t("combat.victory", { xp: result.experienceReward }));
  if (leveledUp) {
    await io.render(t("combat.levelUp", { level: rewarded.player.level }));
  }
  return { state: rewarded, outcome: "victory" };
}

/** Gera o próximo encontro da exploração. */
function nextEncounter(
  state: GameState,
  rng?: Rng,
): { kind: "enemy"; enemyId: string } | { kind: "event"; eventId: string } {
  const random = rng ?? Math.random;
  if (random() < EVENT_CHANCE) {
    return { kind: "event", eventId: "chest" };
  }
  const pool = state.currentRegion.enemyPool;
  const enemyId = pool[Math.floor(random() * pool.length)] ?? pool[0];
  return { kind: "enemy", enemyId };
}

/** Loop de exploração de uma sessão até derrota, vitória do chefe ou saída. */
async function explore(io: GameIO, initial: GameState, options: RunGameOptions): Promise<void> {
  let state = initial;

  while (true) {
    await io.render(renderHUD(state.player));
    const action = await io.exploreAction();

    if (action === "menu") {
      return;
    }
    if (action === "save") {
      await saveGame(state, options);
      await io.render(t("game.saved"));
      continue;
    }
    if (action === "boss") {
      const boss = await resolveCombat(io, state, goblinKing, options.rng);
      state = boss.state;
      if (boss.outcome === "victory") {
        await io.render(t("game.bossDefeated", { boss: localizedName(goblinKing.id) }));
        await saveGame(state, options);
        return;
      }
      if (boss.outcome === "defeat") {
        await io.render(t("game.defeated"));
        return;
      }
      continue;
    }

    const encounter = nextEncounter(state, options.rng);
    if (encounter.kind === "event") {
      const event = findEventById(encounter.eventId);
      if (event) {
        await io.render(event.execute(state).message);
      }
      continue;
    }

    const enemy = findEnemyById(encounter.enemyId);
    if (!enemy) {
      continue;
    }
    const battle = await resolveCombat(io, state, enemy, options.rng);
    state = battle.state;
    if (battle.outcome === "defeat") {
      await io.render(t("game.defeated"));
      return;
    }
    await saveGame(state, options);
  }
}

/**
 * Executa o jogo: menu principal, criação/continuação de personagem e
 * o loop de exploração até o primeiro chefe.
 */
export async function runGame(io: GameIO, options: RunGameOptions = {}): Promise<void> {
  let running = true;
  while (running) {
    const action = await io.mainMenu();

    if (action === "exit") {
      running = false;
      continue;
    }

    if (action === "language") {
      setLanguage(await io.chooseLanguage(getLanguage()));
      continue;
    }

    if (action === "continue") {
      if (!(await hasSave(options))) {
        await io.render(t("game.noSave"));
        continue;
      }
      await explore(io, await loadGame(options), options);
      continue;
    }

    const name = await io.askName();
    const characterClass = await io.chooseClass(AVAILABLE_CLASSES);
    const player = createCharacter({ name, characterClass });
    await explore(io, createInitialGameState(player, startingFields), options);
  }

  await io.render(t("game.farewell"));
}
