import type { GameEvent } from "../../core";

/** Baú — concede ouro e um item. */
export const chest: GameEvent = {
  id: "chest",
  title: "Baú",
  execute: () => ({
    message: "Você encontrou um baú escondido com ouro e uma poção!",
    goldChange: 25,
    itemId: "small_potion",
  }),
};
