import { AVAILABLE_CLASSES } from "./classes";
import {
  darkWoods,
  findBossById,
  findDialogueById,
  findEnemyById,
  findEventById,
  findItemById,
  findKnowledgeById,
  findLootTable,
  findNpcById,
  findQuestById,
  GENERAL_SHOP,
  goblinKing,
  MERCHANT_STOCK,
  REGION_ICONS,
} from "./content";
import {
  applyDialogueEffect,
  applyVictoryRewards,
  CombatEngine,
  createCharacter,
  createInitialGameState,
  discoveryContextFromState,
  effectiveEnemyLevel,
  type GameState,
  GOLD_REWARD_MAX_FACTOR,
  GOLD_REWARD_MIN_FACTOR,
  isCompletable,
  scaleEnemy,
  travelTo,
} from "./core";
import {
  addItem,
  addKnowledge,
  applyLoadoutToPlayer,
  availableOptions,
  buyOffer,
  canTravelTo,
  chooseOption,
  equipFromInventory,
  findLocation,
  getDestinations,
  getLocationState,
  getStartNode,
  hasSave,
  isConsumable,
  loadGame,
  markCompleted,
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
  DialogueNode,
  DialogueOption,
  Enemy,
  EquipmentSlot,
  InventorySlot,
  Item,
  Loadout,
  Location,
  LocationState,
  NPC,
  Player,
  Quest,
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
export type ExploreAction =
  | "explore"
  | "boss"
  | "travel"
  | "hunt"
  | "map"
  | "journal"
  | "world"
  | "inventory"
  | "shop"
  | "save"
  | "menu";

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
  /** Verdadeiro quando a região é explorada como grafo de descoberta (FASE 16). */
  isGraph?: boolean;
  /** Nome localizado do local atual (modo grafo). */
  locationName?: string;
  /** Estados de exibição por local — para desenhar o mapa na tela de exploração. */
  displayStates?: Record<string, LocationState>;
  /** Local onde o jogador está agora (modo grafo). */
  currentLocationId?: string;
}

/** Contexto do mapa da região (modo grafo). */
export interface RegionMapContext {
  region: Region;
  displayStates: Record<string, LocationState>;
  currentLocationId?: string;
  current?: Location;
}

/** Um destino de viagem com seu estado e se é navegável. */
export interface TravelDestination {
  location: Location;
  state: LocationState;
  travelable: boolean;
}

/** Contexto da tela de viagem (mapa + destinos alcançáveis). */
export interface TravelContext extends RegionMapContext {
  destinations: readonly TravelDestination[];
}

/** Escolha do jogador na tela de viagem. */
export type TravelChoice = { type: "go"; locationId: string } | { type: "back" };

/** Contexto de uma conversa com NPC (nó atual + opções disponíveis). */
export interface NpcDialogueContext {
  npc: NPC;
  node: DialogueNode;
  options: readonly DialogueOption[];
  /** Chaves i18n das opções já escolhidas antes (exibidas em cinza). */
  spokenOptions: readonly string[];
}

/** Contexto do diário da região. */
export interface JournalContext {
  region: Region;
  known: readonly string[];
  quest?: Quest;
  locationStates: Record<string, LocationState>;
}

/** Uma região conhecida no mapa-múndi. */
export interface WorldRegionEntry {
  id: string;
  name: string;
  icon: string;
  current: boolean;
}

/** Contexto do mapa-múndi (regiões descobertas). */
export interface WorldMapContext {
  regions: readonly WorldRegionEntry[];
  hasFrontier: boolean;
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
  /** Tela de viagem (modo grafo): escolhe um destino alcançável ou volta. */
  travel?(context: TravelContext): Promise<TravelChoice>;
  /** Conversa com um NPC: devolve o índice da opção escolhida. */
  talk?(context: NpcDialogueContext): Promise<number>;
  /** Mostra o mapa da região e aguarda (modo grafo). */
  regionMap?(context: RegionMapContext): void | Promise<void>;
  /** Mostra o diário da região e aguarda. */
  journal?(context: JournalContext): void | Promise<void>;
  /** Mostra o mapa-múndi e aguarda. */
  worldMap?(context: WorldMapContext): void | Promise<void>;
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

/**
 * Loop de exploração **linear** (legado): encontros aleatórios e chefe fixo.
 * Usado por regiões sem grafo de descoberta (ex.: Campos Iniciais).
 */
async function exploreLinear(
  io: GameIO,
  initial: GameState,
  options: RunGameOptions,
): Promise<void> {
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

/** Estados de exibição de todos os locais da região atual (derivados). */
function computeDisplayStates(state: GameState): Record<string, LocationState> {
  const context = discoveryContextFromState(state);
  const states: Record<string, LocationState> = {};
  for (const location of state.currentRegion.locations ?? []) {
    states[location.id] = getLocationState(location, state.locationStates, context);
  }
  return states;
}

/** Local atual da região (modo grafo). */
function currentLocation(state: GameState): Location | undefined {
  return state.currentLocationId
    ? findLocation(state.currentRegion, state.currentLocationId)
    : undefined;
}

/** Monta o contexto do mapa da região. */
function mapContext(state: GameState): RegionMapContext {
  return {
    region: state.currentRegion,
    displayStates: computeDisplayStates(state),
    currentLocationId: state.currentLocationId,
    current: currentLocation(state),
  };
}

/** Monta o contexto de viagem (mapa + destinos alcançáveis). */
function travelContext(state: GameState): TravelContext {
  const context = discoveryContextFromState(state);
  const destinations = getDestinations(
    state.currentRegion,
    state.currentLocationId ?? state.currentRegion.entryLocationId ?? "",
    state.locationStates,
    context,
  ).map((destination) => ({
    location: destination.location,
    state: destination.state,
    travelable: canTravelTo(destination.state),
  }));
  return { ...mapContext(state), destinations };
}

/** Monta o contexto do diário (conhecimentos + missão ativa). */
function journalContext(state: GameState): JournalContext {
  return {
    region: state.currentRegion,
    known: state.knowledge,
    quest: state.activeQuest,
    locationStates: state.locationStates,
  };
}

/** Monta o contexto do mapa-múndi (apenas a região atual no MVP). */
function worldContext(state: GameState): WorldMapContext {
  const region = state.currentRegion;
  return {
    regions: [
      { id: region.id, name: region.name, icon: REGION_ICONS[region.id] ?? "🗺️", current: true },
    ],
    hasFrontier: true,
  };
}

/** Marca o local atual da região como concluído. */
function completeLocation(state: GameState, locationId: string): GameState {
  return { ...state, locationStates: markCompleted(state.locationStates, locationId) };
}

/** Aplica os efeitos de uma escolha de diálogo, exibindo o feedback ao jogador. */
async function applyEffects(
  io: GameIO,
  state: GameState,
  option: DialogueOption,
  options: RunGameOptions,
): Promise<{ state: GameState; ended: boolean }> {
  const effect = option.effects;
  if (!effect) {
    return { state, ended: false };
  }
  const outcome = applyDialogueEffect(state, effect);
  let next = outcome.state;

  if (effect.grantKnowledge) {
    const fact = findKnowledgeById(effect.grantKnowledge);
    if (fact) {
      await io.render(t("world.knowledgeGained", { fact: t(fact.text) }));
    }
  }
  if (effect.revealLocation) {
    const location = findLocation(next.currentRegion, effect.revealLocation);
    if (location) {
      await io.render(t("world.locationRevealed", { location: t(location.name) }));
    }
  }
  if (outcome.startedQuest && !next.activeQuest) {
    const quest = findQuestById(outcome.startedQuest);
    if (quest) {
      next = { ...next, activeQuest: { ...quest, status: "active" } };
      await io.render(t("world.questStarted", { quest: t(quest.name) }));
    }
  }
  if (outcome.openShop) {
    const merchant = outcome.openShop === "merchant";
    next = await runShop(
      io,
      next,
      merchant ? MERCHANT_STOCK : GENERAL_SHOP,
      merchant ? t("shop.merchantTitle") : t("shop.title"),
      options,
    );
  }
  if (outcome.startCombat) {
    const enemy = findEnemyById(outcome.startCombat);
    if (enemy) {
      const battle = await resolveCombat(io, next, enemy, false, options.rng);
      next = battle.state;
      if (battle.outcome === "defeat") {
        await io.render(t("game.defeated"));
        await io.gameOver?.({ state: next });
        return { state: next, ended: true };
      }
    }
  }
  return { state: next, ended: false };
}

/** Conduz uma conversa com um NPC até o jogador encerrá-la. */
async function runDialogue(
  io: GameIO,
  initial: GameState,
  npc: NPC,
  options: RunGameOptions,
): Promise<{ state: GameState; ended: boolean }> {
  const dialogue = findDialogueById(npc.dialogueId);
  if (!dialogue || !io.talk) {
    return { state: initial, ended: false };
  }
  const existing = initial.npcStates[npc.id];
  let state: GameState = existing?.talkedTo
    ? initial
    : {
        ...initial,
        npcStates: {
          ...initial.npcStates,
          [npc.id]: { talkedTo: true, spokenOptions: existing?.spokenOptions ?? [] },
        },
      };

  let node = getStartNode(dialogue);
  while (true) {
    const available = availableOptions(node, discoveryContextFromState(state));
    if (available.length === 0) {
      break;
    }
    const spokenOptions = state.npcStates[npc.id]?.spokenOptions ?? [];
    const index = await io.talk({ npc, node, options: available, spokenOptions });
    const option = available[Math.max(0, Math.min(index, available.length - 1))];

    // Registra a opção escolhida para exibi-la em cinza nas próximas conversas.
    if (!spokenOptions.includes(option.text)) {
      state = {
        ...state,
        npcStates: {
          ...state.npcStates,
          [npc.id]: {
            ...state.npcStates[npc.id],
            talkedTo: true,
            spokenOptions: [...spokenOptions, option.text],
          },
        },
      };
    }

    const applied = await applyEffects(io, state, option, options);
    state = applied.state;
    if (applied.ended) {
      return { state, ended: true };
    }

    const step = chooseOption(dialogue, option);
    if (step.ends || !step.nextNode) {
      break;
    }
    node = step.nextNode;
  }
  await saveGame(state, options);
  return { state, ended: false };
}

/** Escala um inimigo para o nível do jogador, dentro da faixa da região. */
function scaledEnemy(state: GameState, enemy: Enemy): Enemy {
  const level = effectiveEnemyLevel(enemy.level, state.player.level, state.currentRegion.maxLevel);
  return scaleEnemy(enemy, level);
}

/** Resolve o conteúdo de um local visitado (combate/boss/npc/loja/lore). */
async function resolveLocationContent(
  io: GameIO,
  initial: GameState,
  location: Location,
  alreadyCompleted: boolean,
  options: RunGameOptions,
): Promise<{ state: GameState; ended: boolean }> {
  let state = initial;
  const content = location.content;

  // Revisita: locais de combate podem ser refeitos (grind de XP); os demais
  // completáveis (lore/boss) não repetem — só relembram a descrição.
  if (alreadyCompleted && content.kind !== "combat" && isCompletable(content)) {
    if (location.description) {
      await io.render(t(location.description));
    }
    return { state, ended: false };
  }

  switch (content.kind) {
    case "combat": {
      const enemy = findEnemyById(content.enemyId);
      if (enemy) {
        const battle = await resolveCombat(
          io,
          state,
          scaledEnemy(state, enemy),
          false,
          options.rng,
        );
        state = battle.state;
        if (battle.outcome === "defeat") {
          await io.render(t("game.defeated"));
          await io.gameOver?.({ state });
          return { state, ended: true };
        }
        if (battle.outcome === "victory") {
          state = completeLocation(state, location.id);
          await io.render(t("world.locationCleared", { location: t(location.name) }));
        }
      }
      break;
    }
    case "boss": {
      const boss = findBossById(content.bossId);
      if (boss) {
        const battle = await resolveCombat(io, state, scaledEnemy(state, boss), true, options.rng);
        state = battle.state;
        if (battle.outcome === "defeat") {
          await io.render(t("game.defeated"));
          await io.gameOver?.({ state });
          return { state, ended: true };
        }
        if (battle.outcome === "victory") {
          state = completeLocation(state, location.id);
          await io.render(t("game.bossDefeated", { boss: t(boss.name) }));
          await io.victory?.({ state, bossName: t(boss.name) });
          await saveGame(state, options);
          return { state, ended: true };
        }
      }
      break;
    }
    case "npc": {
      const npc = findNpcById(content.npcId);
      if (npc) {
        const talked = await runDialogue(io, state, npc, options);
        state = talked.state;
        if (talked.ended) {
          return { state, ended: true };
        }
      }
      break;
    }
    case "shop": {
      const merchant = content.shopId === "merchant";
      state = await runShop(
        io,
        state,
        merchant ? MERCHANT_STOCK : GENERAL_SHOP,
        merchant ? t("shop.merchantTitle") : t("shop.title"),
        options,
      );
      break;
    }
    case "lore": {
      const fact = findKnowledgeById(content.knowledgeId);
      if (fact && !state.knowledge.includes(fact.id)) {
        state = { ...state, knowledge: addKnowledge(state.knowledge, fact.id) };
        await io.render(t("world.knowledgeGained", { fact: t(fact.text) }));
      }
      state = completeLocation(state, location.id);
      break;
    }
    default: {
      if (location.description) {
        await io.render(t(location.description));
      }
    }
  }
  return { state, ended: false };
}

/** Viaja para um local e resolve seu conteúdo. */
async function visitLocation(
  io: GameIO,
  initial: GameState,
  locationId: string,
  options: RunGameOptions,
): Promise<{ state: GameState; ended: boolean }> {
  let travel: ReturnType<typeof travelTo>;
  try {
    travel = travelTo(initial.currentRegion, initial, locationId);
  } catch {
    // A UI só oferece destinos navegáveis; uma falha aqui é apenas defensiva.
    return { state: initial, ended: false };
  }
  let state = travel.state;
  await io.render(t("world.arrived", { location: t(travel.location.name) }));

  const resolved = await resolveLocationContent(
    io,
    state,
    travel.location,
    travel.alreadyCompleted,
    options,
  );
  state = resolved.state;
  if (resolved.ended) {
    return { state, ended: true };
  }
  await saveGame(state, options);
  return { state, ended: false };
}

/**
 * Busca um inimigo errante da região para grindar **sem precisar viajar**.
 * Sorteia um inimigo do `enemyPool` da região, escala ao nível do jogador e
 * resolve o combate. Encontros avulsos não concluem locais do grafo.
 */
async function huntEnemy(
  io: GameIO,
  initial: GameState,
  options: RunGameOptions,
): Promise<{ state: GameState; ended: boolean }> {
  const state = initial;
  const pool = state.currentRegion.enemyPool;
  const random = options.rng ?? Math.random;
  const enemyId = pool[Math.floor(random() * pool.length)] ?? pool[0];
  const enemy = enemyId ? findEnemyById(enemyId) : undefined;
  if (!enemy) {
    await io.render(t("world.huntEmpty"));
    return { state, ended: false };
  }

  await io.render(t("world.hunting"));
  const battle = await resolveCombat(io, state, scaledEnemy(state, enemy), false, options.rng);
  if (battle.outcome === "defeat") {
    await io.render(t("game.defeated"));
    await io.gameOver?.({ state: battle.state });
    return { state: battle.state, ended: true };
  }
  await saveGame(battle.state, options);
  return { state: battle.state, ended: false };
}

/**
 * Loop de exploração por **grafo de descoberta** (FASE 16): o jogador viaja
 * entre locais conhecidos, conversa, investiga e enfrenta o chefe.
 */
async function exploreGraph(
  io: GameIO,
  initial: GameState,
  options: RunGameOptions,
): Promise<void> {
  let state = initial;

  while (true) {
    const here = currentLocation(state);
    const action = await io.exploreAction({
      player: state.player,
      region: state.currentRegion,
      gold: state.inventory.gold,
      itemCount: totalItems(state.inventory),
      isGraph: true,
      locationName: here ? t(here.name) : undefined,
      displayStates: computeDisplayStates(state),
      currentLocationId: state.currentLocationId,
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
    if (action === "map") {
      await io.regionMap?.(mapContext(state));
      continue;
    }
    if (action === "journal") {
      await io.journal?.(journalContext(state));
      continue;
    }
    if (action === "world") {
      await io.worldMap?.(worldContext(state));
      continue;
    }
    if (action === "hunt") {
      const hunted = await huntEnemy(io, state, options);
      state = hunted.state;
      if (hunted.ended) {
        return;
      }
      continue;
    }
    if (action === "travel" && io.travel) {
      const choice = await io.travel(travelContext(state));
      if (choice.type === "back") {
        continue;
      }
      const visited = await visitLocation(io, state, choice.locationId, options);
      state = visited.state;
      if (visited.ended) {
        return;
      }
    }
  }
}

/** Despacha entre exploração por grafo (FASE 16) e linear (legado). */
async function explore(io: GameIO, initial: GameState, options: RunGameOptions): Promise<void> {
  if (initial.currentRegion.locations && initial.currentRegion.locations.length > 0) {
    return exploreGraph(io, initial, options);
  }
  return exploreLinear(io, initial, options);
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
    // FASE 16: novo jogo começa no Bosque Sombrio (grafo de descoberta).
    await explore(io, createInitialGameState(player, darkWoods), options);
  }

  await io.render(t("game.farewell"));
}
