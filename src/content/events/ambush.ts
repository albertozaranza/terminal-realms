import type { GameEvent } from "../../core";

/** Emboscada — inicia combate com um inimigo da região atual. */
export const ambush: GameEvent = {
  id: "ambush",
  title: "Emboscada",
  execute: (gameState) => ({
    message: "Você caiu em uma emboscada!",
    startCombatWith: gameState.currentRegion.enemyPool[0] ?? "goblin",
  }),
};
