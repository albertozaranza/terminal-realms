import type { GameEvent } from "../../core";
import { ambush } from "./ambush";
import { chest } from "./chest";
import { merchant } from "./merchant";

export { ambush } from "./ambush";
export { chest } from "./chest";
export { merchant } from "./merchant";

/** Registro de eventos por id. */
export const EVENTS: Readonly<Record<string, GameEvent>> = {
  chest,
  ambush,
  merchant,
};

/** Ids de eventos disponíveis para a exploração. */
export const EVENT_IDS: readonly string[] = Object.keys(EVENTS);

/** Busca um evento pelo id. Retorna undefined se não existir. */
export function findEventById(id: string): GameEvent | undefined {
  return EVENTS[id];
}
