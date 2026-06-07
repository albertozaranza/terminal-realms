/**
 * Terminal Realms — ponto de entrada.
 *
 * Provê a implementação real de GameIO usando um GameRenderer de tela
 * cheia (inquirer para entrada + ANSI art). A interface é redesenhada a
 * cada mudança de estado, em vez de acumular linhas: a cena atual e um
 * painel de histórico são compostos pelo renderer; a UI nunca escreve
 * diretamente no terminal. Toda a orquestração vive em game.ts e os
 * textos passam pelo i18n (t()).
 */
import inquirer from "inquirer";
import {
  type CombatChoice,
  type CombatContext,
  type CombatSkillOption,
  type EndContext,
  type ExploreAction,
  type ExploreContext,
  type GameIO,
  type InventoryChoice,
  type InventoryContext,
  type JournalContext,
  type NpcDialogueContext,
  type RegionMapContext,
  runGame,
  type ShopChoice,
  type ShopContext,
  type TravelChoice,
  type TravelContext,
  type WorldMapContext,
} from "./game";
import { isConsumable, isEquipment, meetsLevel, sellPrice } from "./systems";
import type { CharacterClass, EquipmentSlot } from "./types";
import {
  GameRenderer,
  GrayListPrompt,
  renderClassGallery,
  renderCombatScreen,
  renderCreationIntro,
  renderDialogueScreen,
  renderExploreScreen,
  renderGameOverScreen,
  renderInventoryScreen,
  renderJournalScreen,
  renderLanguageScreen,
  renderMapScreen,
  renderMenuScreen,
  renderShopScreen,
  renderVictoryScreen,
  renderWorldMapScreen,
} from "./ui";
import { type Language, SUPPORTED_LANGUAGES, t } from "./utils";

const renderer = new GameRenderer();

// List que esmaece (cinza) itens indisponíveis em vez de prefixá-los com `-`.
inquirer.registerPrompt("grayList", GrayListPrompt);

/** Aguarda o jogador pressionar Enter (telas terminais). */
async function pressEnter(): Promise<void> {
  await inquirer.prompt([{ type: "input", name: "_", message: t("prompt.continue") }]);
}

/**
 * Pergunta uma quantidade (digitada no teclado) entre 1 e `max`. Com `max`
 * igual a 1 não há o que escolher e retorna 1 direto.
 */
async function askQuantity(max: number, defaultValue: number): Promise<number> {
  if (max <= 1) {
    return 1;
  }
  const { qty } = await inquirer.prompt<{ qty: string }>([
    {
      type: "input",
      name: "qty",
      message: t("shop.quantityPrompt", { max }),
      default: String(Math.min(defaultValue, max)),
      validate: (value: string) => {
        const parsed = Number(value);
        return Number.isInteger(parsed) && parsed >= 1 && parsed <= max
          ? true
          : t("shop.quantityInvalid", { max });
      },
    },
  ]);
  return Math.min(max, Math.max(1, Math.floor(Number(qty))));
}

const cliIO: GameIO = {
  render: (text) => {
    renderer.pushLog(text);
    renderer.paint();
  },

  mainMenu: async () => {
    renderer.resetLog();
    renderer.paint(renderMenuScreen(renderer.width));
    const { action } = await inquirer.prompt<{
      action: "new" | "continue" | "language" | "exit";
    }>([
      {
        type: "list",
        name: "action",
        message: t("menu.title"),
        choices: [
          { name: t("menu.newGame"), value: "new" },
          { name: t("menu.continue"), value: "continue" },
          { name: t("menu.language"), value: "language" },
          { name: t("menu.exit"), value: "exit" },
        ],
      },
    ]);
    return action;
  },

  askName: async () => {
    renderer.paint(renderCreationIntro(renderer.width));
    const { name } = await inquirer.prompt<{ name: string }>([
      {
        type: "input",
        name: "name",
        message: t("prompt.characterName"),
        default: t("prompt.defaultName"),
      },
    ]);
    return name;
  },

  chooseClass: async (classes: readonly CharacterClass[]) => {
    renderer.paint(renderClassGallery(classes, renderer.width));
    const { id } = await inquirer.prompt<{ id: string }>([
      {
        type: "list",
        name: "id",
        message: t("prompt.chooseClass"),
        choices: classes.map((c) => ({ name: t(`name.${c.id}`), value: c.id })),
      },
    ]);
    return classes.find((c) => c.id === id) ?? classes[0];
  },

  chooseLanguage: async (current: Language) => {
    renderer.paint(renderLanguageScreen(renderer.width));
    const { language } = await inquirer.prompt<{ language: Language }>([
      {
        type: "list",
        name: "language",
        message: t("prompt.chooseLanguage"),
        default: current,
        choices: SUPPORTED_LANGUAGES.map((lang) => ({ name: t(`language.${lang}`), value: lang })),
      },
    ]);
    return language;
  },

  exploreAction: async (context: ExploreContext) => {
    renderer.paint(renderExploreScreen(context, renderer.width));
    // Modo grafo (FASE 16): viajar/mapa/diário/mundo; modo linear: legado.
    const choices = context.isGraph
      ? [
          { name: t("explore.travel"), value: "travel" },
          { name: t("explore.map"), value: "map" },
          { name: t("explore.journal"), value: "journal" },
          { name: t("explore.world"), value: "world" },
          { name: t("explore.inventory"), value: "inventory" },
          { name: t("explore.save"), value: "save" },
          { name: t("explore.menu"), value: "menu" },
        ]
      : [
          { name: t("explore.explore"), value: "explore" },
          { name: t("explore.boss", { boss: t("name.goblin_king") }), value: "boss" },
          { name: t("explore.inventory"), value: "inventory" },
          { name: t("explore.shop"), value: "shop" },
          { name: t("explore.save"), value: "save" },
          { name: t("explore.menu"), value: "menu" },
        ];
    const { action } = await inquirer.prompt<{ action: ExploreAction }>([
      { type: "list", name: "action", message: t("prompt.exploreAction"), choices },
    ]);
    return action;
  },

  travel: async (context: TravelContext): Promise<TravelChoice> => {
    renderer.paint(renderMapScreen(context, renderer.width));
    const { choice } = await inquirer.prompt<{ choice: string }>([
      {
        type: "grayList",
        name: "choice",
        message: t("prompt.travel"),
        choices: [
          ...context.destinations.map((destination) => ({
            name: `${destination.location.icon} ${t(destination.location.name)}`,
            value: `go:${destination.location.id}`,
            disabled: destination.travelable ? false : t("travel.locked"),
          })),
          { name: t("travel.back"), value: "back" },
        ],
      },
    ]);
    if (choice === "back" || !choice.startsWith("go:")) {
      return { type: "back" };
    }
    return { type: "go", locationId: choice.slice("go:".length) };
  },

  talk: async (context: NpcDialogueContext): Promise<number> => {
    renderer.paint(renderDialogueScreen(context, renderer.width));
    const { index } = await inquirer.prompt<{ index: number }>([
      {
        type: "list",
        name: "index",
        message: t("prompt.dialogue"),
        choices: context.options.map((option, position) => ({
          name: t(option.text),
          value: position,
        })),
      },
    ]);
    return index;
  },

  regionMap: async (context: RegionMapContext) => {
    renderer.paint(renderMapScreen(context, renderer.width));
    await pressEnter();
  },

  journal: async (context: JournalContext) => {
    renderer.paint(renderJournalScreen(context, renderer.width));
    await pressEnter();
  },

  worldMap: async (context: WorldMapContext) => {
    renderer.paint(renderWorldMapScreen(context, renderer.width));
    await pressEnter();
  },

  inventory: async (context: InventoryContext): Promise<InventoryChoice> => {
    renderer.paint(renderInventoryScreen(context, renderer.width));

    const equipChoices = context.items
      .filter((slot) => isEquipment(slot.item))
      .map((slot) => ({
        name: t("inventory.equip", { item: t(slot.item.name) }),
        value: `equip:${slot.item.id}`,
      }));
    const useChoices = context.items
      .filter((slot) => isConsumable(slot.item))
      .map((slot) => ({
        name: t("inventory.use", { item: t(slot.item.name), quantity: slot.quantity }),
        value: `use:${slot.item.id}`,
      }));
    const unequipChoices = Object.entries(context.loadout)
      .filter(([, item]) => item !== undefined)
      .map(([slot, item]) => ({
        name: t("inventory.unequip", { item: t(item.name) }),
        value: `unequip:${slot}`,
      }));

    const { action } = await inquirer.prompt<{ action: string }>([
      {
        type: "list",
        name: "action",
        message: t("inventory.action"),
        choices: [
          ...equipChoices,
          ...useChoices,
          ...unequipChoices,
          { name: t("inventory.close"), value: "close" },
        ],
      },
    ]);

    if (action.startsWith("equip:")) {
      return { type: "equip", itemId: action.slice("equip:".length) };
    }
    if (action.startsWith("use:")) {
      return { type: "use", itemId: action.slice("use:".length) };
    }
    if (action.startsWith("unequip:")) {
      return { type: "unequip", slot: action.slice("unequip:".length) as EquipmentSlot };
    }
    return { type: "close" };
  },

  shop: async (context: ShopContext): Promise<ShopChoice> => {
    // Menu em dois níveis: primeiro escolhe Comprar/Vender/Sair, depois o
    // item. Mantém compra e venda separadas e permite voltar sem sair.
    while (true) {
      renderer.paint(renderShopScreen(context, renderer.width));
      const { action } = await inquirer.prompt<{ action: "buy" | "sell" | "close" }>([
        {
          type: "list",
          name: "action",
          message: t("shop.action"),
          choices: [
            { name: t("shop.buyMenu"), value: "buy" },
            { name: t("shop.sellMenu"), value: "sell" },
            { name: t("shop.close"), value: "close" },
          ],
        },
      ]);

      if (action === "close") {
        return { type: "close" };
      }

      if (action === "buy") {
        renderer.paint(renderShopScreen(context, renderer.width));
        // Ofertas bloqueadas (nível ou ouro) ficam esmaecidas no grayList.
        const { choice } = await inquirer.prompt<{ choice: string }>([
          {
            type: "grayList",
            name: "choice",
            message: t("shop.buyMenu"),
            choices: [
              ...context.offers.map((offer) => ({
                name: t("shop.itemLine", { item: t(offer.item.name), price: offer.price }),
                value: `buy:${offer.item.id}`,
                disabled: !meetsLevel(context.player, offer)
                  ? t("shop.reqLevel", { level: offer.requiredLevel })
                  : context.gold < offer.price
                    ? t("shop.noGold")
                    : false,
              })),
              { name: t("shop.back"), value: "back" },
            ],
          },
        ]);
        if (choice === "back") {
          continue;
        }
        const itemId = choice.slice("buy:".length);
        const offer = context.offers.find((entry) => entry.item.id === itemId);
        const affordable = offer ? Math.floor(context.gold / offer.price) : 1;
        const quantity = await askQuantity(Math.max(1, affordable), 1);
        return { type: "buy", itemId, quantity };
      }

      // Vender.
      renderer.paint(renderShopScreen(context, renderer.width));
      const { choice } = await inquirer.prompt<{ choice: string }>([
        {
          type: "list",
          name: "choice",
          message: t("shop.sellMenu"),
          choices: [
            ...context.sellable.map((slot) => ({
              name: t("shop.sellLine", {
                item: t(slot.item.name),
                quantity: slot.quantity,
                price: sellPrice(slot.item),
              }),
              value: `sell:${slot.item.id}`,
            })),
            { name: t("shop.back"), value: "back" },
          ],
        },
      ]);
      if (choice === "back") {
        continue;
      }
      const itemId = choice.slice("sell:".length);
      const slot = context.sellable.find((entry) => entry.item.id === itemId);
      const stack = slot?.quantity ?? 1;
      // Padrão: vender a pilha inteira (ajustável digitando).
      const quantity = await askQuantity(stack, stack);
      return { type: "sell", itemId, quantity };
    }
  },

  combatAction: async (context: CombatContext, options: readonly CombatSkillOption[]) => {
    renderer.paint(renderCombatScreen(context, renderer.width));
    const { action } = await inquirer.prompt<{ action: string }>([
      {
        type: "grayList",
        name: "action",
        message: t("prompt.combatAction"),
        choices: [
          { name: t("combat.attack"), value: "attack" },
          ...options.map(({ skill, cooldown }) => ({
            name: t(skill.name),
            value: `skill:${skill.id}`,
            disabled:
              cooldown > 0
                ? t("combat.cooldown", { turns: cooldown })
                : context.player.mana < skill.manaCost
                  ? t("combat.noMana", { cost: skill.manaCost })
                  : false,
          })),
          ...context.items.map(({ item, quantity }) => ({
            name: t("combat.item", { item: t(item.name), quantity }),
            value: `item:${item.id}`,
          })),
          { name: t("combat.flee"), value: "flee" },
        ],
      },
    ]);
    if (action === "attack" || action === "flee") {
      return action as CombatChoice;
    }
    if (action.startsWith("item:")) {
      const itemId = action.slice("item:".length);
      const item = context.items.find((option) => option.item.id === itemId)?.item;
      return item ? { type: "item", item } : "attack";
    }
    const skillId = action.replace("skill:", "");
    const skill = options.find((o) => o.skill.id === skillId)?.skill;
    return skill ? { type: "skill", skill } : "attack";
  },

  victory: async (context: EndContext) => {
    renderer.paintRaw(
      renderVictoryScreen({ ...context, elapsed: renderer.elapsed() }, renderer.width),
    );
    await pressEnter();
  },

  gameOver: async (context: EndContext) => {
    renderer.paintRaw(
      renderGameOverScreen({ ...context, elapsed: renderer.elapsed() }, renderer.width),
    );
    await pressEnter();
  },
};

runGame(cliIO).catch((error: unknown) => {
  console.error("Erro fatal:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
