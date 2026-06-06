import { describe, expect, it } from "vitest";
import type { GameIO, RunGameOptions } from "./game";
import { runGame } from "./game";
import type { SaveStorage } from "./systems";

function memoryStorage(): SaveStorage {
  const files = new Map<string, string>();
  return {
    read: async (path) => {
      const data = files.get(path);
      if (data === undefined) {
        throw new Error(`arquivo não encontrado: ${path}`);
      }
      return data;
    },
    write: async (path, data) => {
      files.set(path, data);
    },
    exists: async (path) => files.has(path),
  };
}

/** Cria uma IO roteirizada para um playthrough determinístico. */
function scriptIO(overrides: Partial<GameIO> = {}): { io: GameIO; outputs: string[] } {
  const outputs: string[] = [];
  let menuCalls = 0;
  const io: GameIO = {
    render: (text) => {
      outputs.push(text);
    },
    mainMenu: async () => (menuCalls++ === 0 ? "new" : "exit"),
    askName: async () => "Hero",
    chooseClass: async (classes) => classes[0], // Guerreiro
    exploreAction: async () => "boss",
    combatAction: async () => "attack",
    ...overrides,
  };
  return { io, outputs };
}

const options = (): RunGameOptions => ({
  storage: memoryStorage(),
  path: "save.json",
  rng: () => 0,
});

describe("runGame — playthrough", () => {
  it("é jogável do início até derrotar o Rei Goblin", async () => {
    const { io, outputs } = scriptIO();
    await runGame(io, options());
    expect(outputs.some((line) => line.includes("derrotou o Rei Goblin"))).toBe(true);
  });

  it("o Mago nível 1 pode ser derrotado pelo chefe", async () => {
    const { io, outputs } = scriptIO({
      chooseClass: async (classes) => classes[2], // Mago
    });
    await runGame(io, options());
    expect(outputs.some((line) => line.includes("foi derrotado"))).toBe(true);
  });

  it("informa quando não há save ao continuar", async () => {
    let menuCalls = 0;
    const { io, outputs } = scriptIO({
      mainMenu: async () => (menuCalls++ === 0 ? "continue" : "exit"),
    });
    await runGame(io, options());
    expect(outputs.some((line) => line.includes("Nenhum save"))).toBe(true);
  });

  it("permite fugir do combate", async () => {
    let menuCalls = 0;
    let exploreCalls = 0;
    const { io } = scriptIO({
      mainMenu: async () => (menuCalls++ === 0 ? "new" : "exit"),
      exploreAction: async () => (exploreCalls++ === 0 ? "explore" : "menu"),
      combatAction: async () => "flee",
    });
    await expect(runGame(io, options())).resolves.toBeUndefined();
  });

  it("encerra ao escolher sair", async () => {
    const { io, outputs } = scriptIO({ mainMenu: async () => "exit" });
    await runGame(io, options());
    expect(outputs.some((line) => line.includes("Até a próxima"))).toBe(true);
  });
});
