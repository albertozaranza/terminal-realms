import chalk from "chalk";
import type { EquipmentSlot, InventorySlot, Loadout, Player, Rarity } from "../../types";
import { t } from "../../utils";
import { columns, panel } from "../components";

/** Dados necessários para desenhar a tela de inventário (somente leitura). */
export interface InventoryScreenView {
  player: Player;
  loadout: Loadout;
  items: readonly InventorySlot[];
  gold: number;
}

/** Cor de cada raridade para destacar os itens. */
const RARITY_COLOR: Record<Rarity, (text: string) => string> = {
  common: chalk.white,
  uncommon: chalk.green,
  rare: chalk.blueBright,
  epic: chalk.magentaBright,
  legendary: chalk.yellowBright,
};

/** Largura fixa de cada célula de slot do paper-doll. */
const SLOT_WIDTH = 18;

/** Espaço útil de texto dentro de uma célula (descontando bordas e padding). */
const SLOT_TEXT = SLOT_WIDTH - 4;

/** Pinta o nome de um item conforme a raridade. */
function itemLabel(name: string, rarity: Rarity): string {
  return RARITY_COLOR[rarity](name);
}

/** Trunca um texto com reticências para caber na largura informada. */
function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

/** Renderiza uma célula de slot (equipado ou vazio) como mini-painel. */
function slotCell(slot: EquipmentSlot, loadout: Loadout): string {
  const equipped = loadout[slot];
  const body = equipped
    ? itemLabel(truncate(t(equipped.name), SLOT_TEXT), equipped.rarity)
    : chalk.dim(`— ${t("inventory.empty")} —`);
  return panel(body, {
    title: t(`slot.${slot}`),
    width: SLOT_WIDTH,
    align: "center",
    borderColor: equipped ? "yellow" : "gray",
  });
}

/** Espaçador com as mesmas dimensões de um slot, para alinhar a grade. */
function spacerCell(): string {
  const blank = " ".repeat(SLOT_WIDTH);
  return [blank, blank, blank].join("\n");
}

/**
 * Desenha o inventário no layout paper-doll (estilo Tibia): slots de
 * equipamento ao redor do corpo, a mochila com os itens carregados e o
 * ouro na parte inferior.
 */
export function renderInventoryScreen(view: InventoryScreenView, width: number): string {
  const { player, loadout, items, gold } = view;

  const dollRows = [
    columns([slotCell("amulet", loadout), slotCell("helmet", loadout), spacerCell()], 2),
    columns(
      [slotCell("weapon", loadout), slotCell("chest", loadout), slotCell("gloves", loadout)],
      2,
    ),
    columns([slotCell("ring", loadout), slotCell("boots", loadout), spacerCell()], 2),
  ].join("\n");

  const paperDoll = panel(dollRows, {
    title: t("inventory.title"),
    width,
    align: "center",
    borderColor: "cyan",
  });

  const backpackBody =
    items.length > 0
      ? items
          .map(
            (slot) =>
              `${chalk.cyan(`${slot.quantity}×`)} ${itemLabel(t(slot.item.name), slot.item.rarity)}`,
          )
          .join("\n")
      : chalk.dim(t("inventory.emptyBackpack"));

  const statusLine = `${chalk.red(
    t("inventory.hp", { hp: player.hp, maxHp: player.maxHp }),
  )}   ${chalk.blue(t("inventory.mana", { mana: player.mana, maxMana: player.maxMana }))}`;
  const goldLine = chalk.yellow(`◈ ${t("inventory.gold", { gold })}`);

  const backpack = panel(`${backpackBody}\n\n${statusLine}\n${goldLine}`, {
    title: t("inventory.backpack"),
    width,
    borderColor: "yellow",
  });

  return [paperDoll, backpack].join("\n");
}
