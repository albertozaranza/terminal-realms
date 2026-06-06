import { promises as fs } from "node:fs";
import { type GameState, SAVE_FILE } from "../core";
import type { Inventory, Item } from "../types";
import { SUPPORTED_LANGUAGES, setLanguage, t } from "../utils";
import { addItem } from "./inventory";

/**
 * Abstração de armazenamento do save. Permite injetar um storage em
 * memória nos testes, sem tocar no sistema de arquivos.
 */
export interface SaveStorage {
  read(path: string): Promise<string>;
  write(path: string, data: string): Promise<void>;
  exists(path: string): Promise<boolean>;
}

/** Storage padrão baseado em arquivos JSON. */
export const fileStorage: SaveStorage = {
  read: (path) => fs.readFile(path, "utf8"),
  write: (path, data) => fs.writeFile(path, data, "utf8"),
  exists: async (path) => {
    try {
      await fs.access(path);
      return true;
    } catch {
      // Ausência do arquivo significa simplesmente "sem save".
      return false;
    }
  },
};

/** Opções de save/load. */
export interface SaveOptions {
  storage?: SaveStorage;
  path?: string;
}

/** Serializa o estado do jogo em JSON. */
export function serializeGameState(state: GameState): string {
  return JSON.stringify(state, null, 2);
}

/** Salva o estado do jogo (formato JSON). */
export async function saveGame(state: GameState, options: SaveOptions = {}): Promise<void> {
  const storage = options.storage ?? fileStorage;
  const path = options.path ?? SAVE_FILE;
  await storage.write(path, serializeGameState(state));
}

/** Indica se existe um save. */
export async function hasSave(options: SaveOptions = {}): Promise<boolean> {
  const storage = options.storage ?? fileStorage;
  const path = options.path ?? SAVE_FILE;
  return storage.exists(path);
}

/** Valida que um valor desserializado tem a estrutura de um GameState. */
function isGameState(value: unknown): value is GameState {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.player === "object" &&
    candidate.player !== null &&
    typeof candidate.currentRegion === "object" &&
    candidate.currentRegion !== null &&
    typeof candidate.inventory === "object" &&
    candidate.inventory !== null &&
    typeof candidate.statistics === "object" &&
    candidate.statistics !== null
  );
}

/**
 * Normaliza o inventário desserializado para o formato de pilhas
 * (`InventorySlot[]`). Saves antigos guardavam `items` como uma lista de
 * itens "crus" (`Item[]`); estes são reagrupados via `addItem`, preservando
 * o empilhamento de consumíveis. Saves já no formato novo passam intactos.
 */
function migrateInventory(raw: { items?: unknown; gold?: unknown }): Inventory {
  const items = Array.isArray(raw.items) ? raw.items : [];
  const gold = typeof raw.gold === "number" ? raw.gold : 0;

  const alreadySlots = items.every(
    (entry) =>
      typeof entry === "object" && entry !== null && "item" in entry && "quantity" in entry,
  );
  if (alreadySlots) {
    return { items: items as Inventory["items"], gold };
  }

  let inventory: Inventory = { items: [], gold };
  for (const entry of items) {
    inventory = addItem(inventory, entry as Item);
  }
  return inventory;
}

/** Desserializa um GameState a partir de JSON, validando a estrutura. */
export function deserializeGameState(json: string): GameState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error(t("error.save.corruptedJson"));
  }
  if (!isGameState(parsed)) {
    throw new Error(t("error.save.invalidStructure"));
  }
  return {
    ...parsed,
    inventory: migrateInventory(parsed.inventory as { items?: unknown; gold?: unknown }),
  };
}

/** Carrega o estado do jogo a partir do save. Lança erro se não existir. */
export async function loadGame(options: SaveOptions = {}): Promise<GameState> {
  const storage = options.storage ?? fileStorage;
  const path = options.path ?? SAVE_FILE;
  if (!(await storage.exists(path))) {
    throw new Error(t("error.save.notFound", { path }));
  }
  const state = deserializeGameState(await storage.read(path));
  // Restaura o idioma persistido no save.
  if (SUPPORTED_LANGUAGES.includes(state.language)) {
    setLanguage(state.language);
  }
  return state;
}
