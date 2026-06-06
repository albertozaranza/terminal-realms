import { describe, expect, it } from "vitest";
import { chance, pick, type Rng, randomFloat, randomInt, weightedPick } from "./random";

/** Cria um rng que devolve os valores fornecidos em sequência. */
function seq(...values: number[]): Rng {
  let i = 0;
  return () => values[i++ % values.length];
}

describe("randomInt", () => {
  it("retorna o mínimo quando rng é 0", () => {
    expect(randomInt(1, 6, () => 0)).toBe(1);
  });

  it("retorna o máximo quando rng tende a 1", () => {
    expect(randomInt(1, 6, () => 0.999999)).toBe(6);
  });

  it("respeita os limites em muitas iterações", () => {
    for (let i = 0; i < 1000; i++) {
      const value = randomInt(1, 6);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it("lança erro quando min > max", () => {
    expect(() => randomInt(5, 1)).toThrow();
  });
});

describe("randomFloat", () => {
  it("retorna um valor dentro do intervalo", () => {
    expect(randomFloat(0, 10, () => 0.5)).toBe(5);
  });

  it("lança erro quando min > max", () => {
    expect(() => randomFloat(5, 1)).toThrow();
  });
});

describe("chance", () => {
  it("retorna true quando rng < probabilidade", () => {
    expect(chance(0.5, () => 0.4)).toBe(true);
  });

  it("retorna false quando rng >= probabilidade", () => {
    expect(chance(0.5, () => 0.5)).toBe(false);
  });

  it("lança erro para probabilidade fora de [0, 1]", () => {
    expect(() => chance(1.5)).toThrow();
    expect(() => chance(-0.1)).toThrow();
  });
});

describe("pick", () => {
  it("escolhe o elemento conforme o rng", () => {
    expect(pick(["a", "b", "c"], () => 0)).toBe("a");
    expect(pick(["a", "b", "c"], () => 0.999999)).toBe("c");
  });

  it("lança erro para array vazio", () => {
    expect(() => pick([])).toThrow();
  });
});

describe("weightedPick", () => {
  const entries = [
    { item: "comum", weight: 70 },
    { item: "raro", weight: 30 },
  ];

  it("escolhe o primeiro item para rolagem baixa", () => {
    expect(weightedPick(entries, seq(0))).toBe("comum");
  });

  it("escolhe o segundo item para rolagem alta", () => {
    expect(weightedPick(entries, seq(0.99))).toBe("raro");
  });

  it("lança erro para lista vazia", () => {
    expect(() => weightedPick([])).toThrow();
  });

  it("lança erro quando a soma dos pesos é zero", () => {
    expect(() => weightedPick([{ item: "x", weight: 0 }])).toThrow();
  });

  it("lança erro para peso negativo", () => {
    expect(() => weightedPick([{ item: "x", weight: -1 }])).toThrow();
  });
});
