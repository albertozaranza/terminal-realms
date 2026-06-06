import { describe, expect, it } from "vitest";
import { getStartupMessage } from "./index";

describe("getStartupMessage", () => {
  it("retorna a mensagem de inicialização do jogo", () => {
    expect(getStartupMessage()).toBe("Terminal Realms — projeto inicializado.");
  });
});
