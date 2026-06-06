import { describe, expect, it } from "vitest";
import { clamp, percentOf, sum } from "./math";

describe("clamp", () => {
  it("mantém valor dentro do intervalo", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("limita ao mínimo", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it("limita ao máximo", () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it("lança erro quando min > max", () => {
    expect(() => clamp(5, 10, 0)).toThrow();
  });
});

describe("sum", () => {
  it("soma os valores", () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  it("retorna 0 para lista vazia", () => {
    expect(sum([])).toBe(0);
  });
});

describe("percentOf", () => {
  it("calcula a porcentagem de um valor", () => {
    expect(percentOf(50, 150)).toBe(75);
    expect(percentOf(200, 50)).toBe(100);
  });
});
