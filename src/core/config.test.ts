import { describe, expect, it } from "vitest";
import { CURRENCY, GAME_NAME, MAX_LEVEL, MIN_DAMAGE, SAVE_FILE, START_REGION } from "./config";

describe("config", () => {
  it("define o nível máximo em 50 (GDD)", () => {
    expect(MAX_LEVEL).toBe(50);
  });

  it("usa save.json como arquivo de save", () => {
    expect(SAVE_FILE).toBe("save.json");
  });

  it("inicia na região Campos Iniciais", () => {
    expect(START_REGION).toBe("starting_fields");
  });

  it("garante dano mínimo de 1", () => {
    expect(MIN_DAMAGE).toBe(1);
  });

  it("usa Gold como moeda", () => {
    expect(CURRENCY).toBe("Gold");
  });

  it("nomeia o jogo como Terminal Realms", () => {
    expect(GAME_NAME).toBe("Terminal Realms");
  });
});
