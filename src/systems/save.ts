import { promises as fs } from "node:fs";
import { type GameState, SAVE_FILE } from "../core";

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
