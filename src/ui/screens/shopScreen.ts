import chalk from "chalk";
import { canAfford, meetsLevel, sellPrice } from "../../systems";
import type { InventorySlot, Player, Rarity, ShopOffer } from "../../types";
import { t } from "../../utils";
import { panel } from "../components";

/** Dados necessários para desenhar a tela da loja (somente leitura). */
export interface ShopScreenView {
  player: Player;
  gold: number;
  offers: readonly ShopOffer[];
  sellable: readonly InventorySlot[];
  /** Título da loja (loja fixa ou mercador ambulante). */
  title: string;
}

/** Cor de cada raridade para destacar os itens. */
const RARITY_COLOR: Record<Rarity, (text: string) => string> = {
  common: chalk.white,
  uncommon: chalk.green,
  rare: chalk.blueBright,
  epic: chalk.magentaBright,
  legendary: chalk.yellowBright,
};

/**
 * Desenha a loja: itens à venda (com preço e nível exigido — bloqueados em
 * cinza quando o jogador não atende ao requisito ou não tem ouro), os itens
 * que o jogador pode vender e o ouro disponível.
 */
export function renderShopScreen(view: ShopScreenView, width: number): string {
  const { player, gold, offers, sellable, title } = view;

  const buyBody = offers
    .map((offer) => {
      const locked = !meetsLevel(player, offer) || !canAfford({ items: [], gold }, offer);
      const name = RARITY_COLOR[offer.item.rarity](t(offer.item.name));
      const price = chalk.yellow(`${offer.price}◈`);
      const req = chalk.gray(`Lv ${offer.requiredLevel}`);
      const line = `${name} — ${price}  ${req}`;
      return locked ? chalk.dim(`🔒 ${line}`) : `• ${line}`;
    })
    .join("\n");

  const buyPanel = panel(buyBody, { title, width, borderColor: "green" });

  const sellBody =
    sellable.length > 0
      ? sellable
          .map(
            (slot) =>
              `${chalk.cyan(`${slot.quantity}×`)} ${RARITY_COLOR[slot.item.rarity](
                t(slot.item.name),
              )} — ${chalk.yellow(`${sellPrice(slot.item)}◈`)}`,
          )
          .join("\n")
      : chalk.dim(t("shop.nothingToSell"));

  const goldLine = chalk.yellow(`◈ ${t("shop.gold", { gold })}`);

  const sellPanel = panel(`${sellBody}\n\n${goldLine}`, {
    title: t("shop.sellTitle"),
    width,
    borderColor: "yellow",
  });

  return [buyPanel, sellPanel].join("\n");
}
