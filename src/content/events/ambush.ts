import type { GameEvent } from "../../core";

/** Emboscada — inicia combate com um inimigo da região atual. */
export const ambush: GameEvent = {
  id: "ambush",
  title: "event.ambush.title",
  execute: (gameState) => ({
    message: "event.ambush.message",
    startCombatWith: gameState.currentRegion.enemyPool[0] ?? "goblin",
  }),
};
