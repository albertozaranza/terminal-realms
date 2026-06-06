import type { GameEvent } from "../../core";

/** Mercador ambulante — abre uma loja. */
export const merchant: GameEvent = {
  id: "merchant",
  title: "event.merchant.title",
  execute: () => ({
    message: "event.merchant.message",
    openShop: true,
  }),
};
