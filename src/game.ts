import { AVAILABLE_CLASSES } from "./classes";
import {
  findEnemyById,
  findEventById,
  findItemById,
  findLootTable,
  GENERAL_SHOP,
  goblinKing,
  MERCHANT_STOCK,
  startingFields,
} from "./content";
import {
  applyVictoryRewards,
  CombatEngine,
  createCharacter,
  createInitialGameState,
  type GameState,
  GOLD_REWARD_MAX_FACTOR,
  GOLD_REWARD_MIN_FACTOR,
} from "./core";
import {
  addItem,
  applyLoadoutToPlayer,
  buyOffer,
  equipFromInventory,
  hasSave,
  isConsumable,
  loadGame,
  meetsLevel,
  removeItem,
  rollLoot,
  type SaveOptions,
  saveGame,
  sellItem,
  sellPrice,
  totalItems,
  unequipToInventory,
  useConsumable,
} from "./systems";
import type {
  CharacterClass,
  Consumable,
  Enemy,
  EquipmentSlot,
  InventorySlot,
  Item,
  Loadout,
  Player,
  Region,
  ShopOffer,
  Skill,
} from "./types";
import { getLanguage, type Language, type Rng, randomInt, setLanguage, t } from "./utils";

/** Nome localizado de uma entidade pelo seu id (fallback para o id). */
function localizedName(id: string): string {
  return t(`name.${id}`);
}

/** Ação escolhida no menu de exploração. */
export type ExploreAction = "explore" | "boss" | "inventory" | "shop" | "save" | "menu";

/** Contexto da tela de loja (somente leitura, para a UI desenhar). */
export interface ShopContext {
  player: Player;
  gold: number;
  offers: readonly ShopOffer[];
  sellable: readonly InventorySlot[];
  /** Título da loja (loja fixa ou mercador). */
  title: string;
}

/** Escolha do jogador na loja. */
export type ShopChoice =
  | { type: "buy"; itemId: string; quantity: number }
  | { type: "sell"; itemId: string; quantity: number }
  | { type: "close" };

/** Contexto da tela de inventário (somente leitura, para a UI desenhar). */
export interface InventoryContext {
  player: Player;
  loadout: Loadout;
  items: readonly InventorySlot[];
  gold: number;
}

/** Escolha do jogador na tela de inventário. */
export type InventoryChoice =
  | { type: "equip"; itemId: string }
  | { type: "unequip"; slot: EquipmentSlot }
  | { type: "use"; itemId: string }
  | { type: "close" };

/** Escolha do jogador durante um turno de combate. */
export type CombatChoice =
  | "attack"
  | "flee"
  | { type: "skill"; skill: Skill }
  | { type: "item"; item: Consumable };

/** Habilidade disponível no menu de combate, com o cooldown atual (em rodadas). */
export interface CombatSkillOption {
  skill: Skill;
  /** Rodadas restantes de cooldown; 0 quando a habilidade está pronta. */
  cooldown: number;
}

/** Consumível disponível no menu de combate, com a quantidade carregada. */
export interface CombatItemOption {
  item: Consumable;
  quantity: number;
}

/** Resultado de um combate na sessão. */
export type CombatOutcome = "victory" | "defeat" | "fled";

/** Contexto da tela de exploração (somente leitura, para a UI desenhar). */
export interface ExploreContext {
  player: Player;
  region: Region;
  gold: number;
  /** Quantidade de itens no inventário canônico (GameState.inventory). */
  itemCount: number;
}

/** Visão do inimigo em combate (somente leitura, para a UI desenhar). */
export interface CombatEnemyView {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
}

/** Contexto da tela de combate (somente leitura, para a UI desenhar). */
export interface CombatContext {
  player: Player;
  enemy: CombatEnemyView;
  isBoss: boolean;
  /** Consumíveis disponíveis para usar no combate (ação "item"). */
  items: readonly CombatItemOption[];
}

/** Contexto das telas de fim de jogo (vitória/derrota). */
export interface EndContext {
  state: GameState;
  /** Nome localizado do chefe derrotado (apenas na vitória). */
  bossName?: string;
}

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
  exploreAction(context: ExploreContext): Promise<ExploreAction>;
  combatAction(context: CombatContext, skills: readonly CombatSkillOption[]): Promise<CombatChoice>;
  /** Tela de inventário: equipar/desequipar itens ou fechar. */
  inventory(context: InventoryContext): Promise<InventoryChoice>;
  /** Tela de loja: comprar/vender itens ou sair. */
  shop(context: ShopContext): Promise<ShopChoice>;
  /** Tela dedicada de vitória (chefe). Opcional: a UI pode implementá-la. */
  victory?(context: EndContext): void | Promise<void>;
  /** Tela dedicada de fim de jogo (derrota). Opcional. */
  gameOver?(context: EndContext): void | Promise<void>;
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
  // Ouro proporcional à dificuldade do inimigo (fração da recompensa de XP).
  const goldReward = randomInt(
    Math.round(experienceReward * GOLD_REWARD_MIN_FACTOR),
    Math.round(experienceReward * GOLD_REWARD_MAX_FACTOR),
    rng,
  );
  const { state: next, leveledUp } = applyVictoryRewards(state, {
    experience: experienceReward,
    loot,
    gold: goldReward,
  });
  return { state: next, leveledUp };
}

/** Lista os consumíveis disponíveis (com quantidade) de um inventário. */
function consumableOptions(inventory: GameState["inventory"]): CombatItemOption[] {
  return inventory.items.flatMap((slot) =>
    isConsumable(slot.item) ? [{ item: slot.item, quantity: slot.quantity }] : [],
  );
}

/** Resolve um combate completo de forma interativa via a porta de IO. */
async function resolveCombat(
  io: GameIO,
  state: GameState,
  enemy: Enemy,
  isBoss: boolean,
  rng?: Rng,
): Promise<{ state: GameState; outcome: CombatOutcome }> {
  const combat = new CombatEngine(applyLoadoutToPlayer(state.player, state.loadout), enemy);
  combat.start();
  const skills =
    AVAILABLE_CLASSES.find((c) => c.id === state.player.classId)?.getStartingSkills() ?? [];

  const enemyName = localizedName(enemy.id);
  // maxHp do inimigo = hp do template original (a engine opera sobre cópias).
  const enemyMaxHp = enemy.hp;
  // Inventário acompanha o combate: consumíveis usados são descontados aqui.
  let inventory = state.inventory;
  await io.render(t("combat.appeared", { name: enemyName }));

  while (!combat.isOver()) {
    const context: CombatContext = {
      player: combat.getPlayer(),
      enemy: {
        id: enemy.id,
        name: enemyName,
        level: enemy.level,
        hp: combat.getEnemy().hp,
        maxHp: enemyMaxHp,
      },
      isBoss,
      items: consumableOptions(inventory),
    };
    const choice = await io.combatAction(
      context,
      skills.map((skill) => ({ skill, cooldown: combat.getSkillCooldown(skill.id) })),
    );

    if (choice === "flee") {
      return { state: { ...state, inventory }, outcome: "fled" };
    }
    if (choice === "attack") {
      const hit = combat.playerAttack();
      await io.render(t("combat.playerHit", { damage: hit.damage }));
    } else if (choice.type === "skill") {
      const { result } = combat.useSkill(choice.skill);
      await io.render(t(result.message));
      if (result.damage > 0) {
        await io.render(t("combat.playerHit", { damage: result.damage }));
      }
      if (result.healing > 0) {
        await io.render(t("combat.heal", { amount: result.healing }));
      }
    } else {
      const outcome = combat.useItem(choice.item);
      inventory = removeItem(inventory, choice.item.id);
      await io.render(t("combat.usedItem", { item: t(choice.item.name) }));
      if (outcome.hpRestored > 0) {
        await io.render(t("combat.heal", { amount: outcome.hpRestored }));
      }
      if (outcome.manaRestored > 0) {
        await io.render(t("combat.manaRestored", { amount: outcome.manaRestored }));
      }
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
  // O combate roda sobre um jogador "efetivo" (com bônus de equipamento).
  // Sincronizamos de volta apenas hp/mana — os atributos-base persistidos
  // não recebem os bônus (recalculados a cada combate), e os recursos são
  // limitados aos máximos-base para não vazar bônus de maxHp/maxMana.
  const after = combat.getPlayer();
  const synced: GameState = {
    ...state,
    inventory,
    player: {
      ...state.player,
      hp: Math.min(state.player.maxHp, after.hp),
      mana: Math.min(state.player.maxMana, after.mana),
    },
  };

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

/**
 * Loop da tela de inventário: equipa/desequipa itens conforme a escolha do
 * jogador até ele fechar. Persiste o estado se houve alteração. Retorna o
 * GameState atualizado.
 */
async function manageInventory(
  io: GameIO,
  state: GameState,
  options: RunGameOptions,
): Promise<GameState> {
  let current = state;
  let changed = false;

  while (true) {
    const choice = await io.inventory({
      player: current.player,
      loadout: current.loadout,
      items: current.inventory.items,
      gold: current.inventory.gold,
    });
    if (choice.type === "close") {
      break;
    }

    if (choice.type === "use") {
      const slot = current.inventory.items.find((entry) => entry.item.id === choice.itemId);
      if (slot && isConsumable(slot.item)) {
        current = {
          ...current,
          player: useConsumable(current.player, slot.item),
          inventory: removeItem(current.inventory, choice.itemId),
        };
        changed = true;
      }
      continue;
    }

    const equipState = { inventory: current.inventory, loadout: current.loadout };
    const next =
      choice.type === "equip"
        ? equipFromInventory(equipState, choice.itemId)
        : unequipToInventory(equipState, choice.slot);
    current = { ...current, inventory: next.inventory, loadout: next.loadout };
    changed = true;
  }

  if (changed) {
    await saveGame(current, options);
  }
  return current;
}

/**
 * Loop da loja: o jogador compra (com gate de nível e saldo) e vende itens
 * (a venda desvaloriza) até sair. Persiste se houve alteração. Erros de
 * regra (nível/saldo) viram mensagens, sem quebrar o jogo.
 */
async function runShop(
  io: GameIO,
  state: GameState,
  offers: readonly ShopOffer[],
  title: string,
  options: RunGameOptions,
): Promise<GameState> {
  let current = state;
  let changed = false;

  while (true) {
    const choice = await io.shop({
      player: current.player,
      gold: current.inventory.gold,
      offers,
      sellable: current.inventory.items,
      title,
    });
    if (choice.type === "close") {
      break;
    }

    if (choice.type === "buy") {
      const offer = offers.find((entry) => entry.item.id === choice.itemId);
      if (!offer) {
        continue;
      }
      if (!meetsLevel(current.player, offer)) {
        await io.render(
          t("shop.levelLocked", { item: t(offer.item.name), level: offer.requiredLevel }),
        );
        continue;
      }
      // Limita a compra ao que o jogador consegue pagar.
      const affordable = Math.floor(current.inventory.gold / offer.price);
      const amount = Math.min(Math.max(1, choice.quantity), affordable);
      if (amount < 1) {
        await io.render(t("shop.cantAfford", { item: t(offer.item.name) }));
        continue;
      }
      current = {
        ...current,
        inventory: buyOffer(current.inventory, current.player, offer, amount),
      };
      await io.render(t("shop.bought", { quantity: amount, item: t(offer.item.name) }));
      changed = true;
      continue;
    }

    // Venda.
    const slot = current.inventory.items.find((entry) => entry.item.id === choice.itemId);
    if (!slot) {
      continue;
    }
    const amount = Math.min(Math.max(1, choice.quantity), slot.quantity);
    const gain = sellPrice(slot.item) * amount;
    current = { ...current, inventory: sellItem(current.inventory, choice.itemId, amount) };
    await io.render(t("shop.sold", { quantity: amount, item: t(slot.item.name), gold: gain }));
    changed = true;
  }

  if (changed) {
    await saveGame(current, options);
  }
  return current;
}

/** Gera o próximo encontro da exploração. */
function nextEncounter(
  state: GameState,
  rng?: Rng,
): { kind: "enemy"; enemyId: string } | { kind: "event"; eventId: string } {
  const random = rng ?? Math.random;
  if (random() < EVENT_CHANCE) {
    // Metade dos eventos é o mercador ambulante (loja com itens exclusivos).
    const eventId = random() >= 0.5 ? "merchant" : "chest";
    return { kind: "event", eventId };
  }
  const pool = state.currentRegion.enemyPool;
  const enemyId = pool[Math.floor(random() * pool.length)] ?? pool[0];
  return { kind: "enemy", enemyId };
}

/** Loop de exploração de uma sessão até derrota, vitória do chefe ou saída. */
async function explore(io: GameIO, initial: GameState, options: RunGameOptions): Promise<void> {
  let state = initial;

  while (true) {
    const action = await io.exploreAction({
      player: state.player,
      region: state.currentRegion,
      gold: state.inventory.gold,
      itemCount: totalItems(state.inventory),
    });

    if (action === "menu") {
      return;
    }
    if (action === "save") {
      await saveGame(state, options);
      await io.render(t("game.saved"));
      continue;
    }
    if (action === "inventory") {
      state = await manageInventory(io, state, options);
      continue;
    }
    if (action === "shop") {
      state = await runShop(io, state, GENERAL_SHOP, t("shop.title"), options);
      continue;
    }
    if (action === "boss") {
      const boss = await resolveCombat(io, state, goblinKing, true, options.rng);
      state = boss.state;
      if (boss.outcome === "victory") {
        await io.render(t("game.bossDefeated", { boss: localizedName(goblinKing.id) }));
        await io.victory?.({ state, bossName: localizedName(goblinKing.id) });
        await saveGame(state, options);
        return;
      }
      if (boss.outcome === "defeat") {
        await io.render(t("game.defeated"));
        await io.gameOver?.({ state });
        return;
      }
      continue;
    }

    const encounter = nextEncounter(state, options.rng);
    if (encounter.kind === "event") {
      const event = findEventById(encounter.eventId);
      if (event) {
        const result = event.execute(state);
        await io.render(t(result.message));
        // Aplica os efeitos do evento ao estado (ouro, item, loja).
        if (result.goldChange) {
          const gold = state.inventory.gold + result.goldChange;
          const inventory = { ...state.inventory, gold: Math.max(0, gold) };
          state = { ...state, inventory };
        }
        if (result.itemId) {
          const item = findItemById(result.itemId);
          if (item) {
            state = { ...state, inventory: addItem(state.inventory, item) };
          }
        }
        if (result.openShop) {
          state = await runShop(io, state, MERCHANT_STOCK, t("shop.merchantTitle"), options);
        }
        await saveGame(state, options);
      }
      continue;
    }

    const enemy = findEnemyById(encounter.enemyId);
    if (!enemy) {
      continue;
    }
    const battle = await resolveCombat(io, state, enemy, false, options.rng);
    state = battle.state;
    if (battle.outcome === "defeat") {
      await io.render(t("game.defeated"));
      await io.gameOver?.({ state });
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
