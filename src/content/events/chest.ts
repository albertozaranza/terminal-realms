import type { GameEvent } from "../../core";

/** Baú — concede ouro e um item. */
export const chest: GameEvent = {
  id: "chest",
  title: "event.chest.title",
  execute: () => ({
    message: "event.chest.message",
    goldChange: 25,
    itemId: "small_potion",
  }),
};
