import { describe, expect, it } from "vitest";
import { CURRENCY, GAME_NAME, MAX_LEVEL, MIN_DAMAGE, SAVE_FILE, START_REGION } from "../config";

describe("config", () => {
  it("sets the max level to 50 (GDD)", () => {
    expect(MAX_LEVEL).toBe(50);
  });

  it("uses save.json as the save file", () => {
    expect(SAVE_FILE).toBe("save.json");
  });

  it("starts in the Starting Fields region", () => {
    expect(START_REGION).toBe("starting_fields");
  });

  it("guarantees a minimum damage of 1", () => {
    expect(MIN_DAMAGE).toBe(1);
  });

  it("uses Gold as the currency", () => {
    expect(CURRENCY).toBe("Gold");
  });

  it("names the game Terminal Realms", () => {
    expect(GAME_NAME).toBe("Terminal Realms");
  });
});
