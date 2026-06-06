import { describe, expect, it } from "vitest";
import { roll, rollDice, rollDie } from "./dice";

describe("rollDie", () => {
  it("retorna um valor entre 1 e sides", () => {
    for (let i = 0; i < 1000; i++) {
      const value = rollDie(20);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(20);
    }
  });

  it("usa o rng fornecido", () => {
    expect(rollDie(6, () => 0)).toBe(1);
    expect(rollDie(6, () => 0.999999)).toBe(6);
  });

  it("lança erro para número de lados inválido", () => {
    expect(() => rollDie(0)).toThrow();
    expect(() => rollDie(2.5)).toThrow();
  });
});

describe("rollDice", () => {
  it("soma os dados rolados", () => {
    // rng fixo em 0 => cada dado retorna 1; 3 dados => 3.
    expect(rollDice(3, 6, () => 0)).toBe(3);
  });

  it("lança erro para quantidade inválida", () => {
    expect(() => rollDice(0, 6)).toThrow();
  });
});

describe("roll (notação)", () => {
  it("interpreta NdM sem modificador", () => {
    expect(roll("2d6", () => 0)).toBe(2);
  });

  it("aplica modificador positivo", () => {
    expect(roll("2d6+3", () => 0)).toBe(5);
  });

  it("aplica modificador negativo", () => {
    expect(roll("3d4-1", () => 0)).toBe(2);
  });

  it("ignora espaços ao redor", () => {
    expect(roll("  1d20  ", () => 0)).toBe(1);
  });

  it("lança erro para notação inválida", () => {
    expect(() => roll("abc")).toThrow();
    expect(() => roll("d6")).toThrow();
  });
});
