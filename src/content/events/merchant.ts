import type { GameEvent } from "../../core";

/** Mercador ambulante — abre uma loja. */
export const merchant: GameEvent = {
  id: "merchant",
  title: "Mercador",
  execute: () => ({
    message: "Um mercador ambulante surge na estrada e abre suas mercadorias.",
    openShop: true,
  }),
};
