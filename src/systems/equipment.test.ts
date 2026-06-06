import { describe, expect, it } from "vitest";
import type { Equipment } from "../types";
import { createLoadout, equip, getEquippedItems, getStatBonus, unequip } from "./equipment";

const espada: Equipment = {
  id: "espada",
  name: "Espada",
  description: "",
  rarity: "common",
  value: 10,
  slot: "weapon",
  modifiers: [{ stat: "strength", value: 2 }],
};

const espadaMelhor: Equipment = {
  id: "espada_melhor",
  name: "Espada Melhor",
  description: "",
  rarity: "rare",
  value: 50,
  slot: "weapon",
  modifiers: [{ stat: "strength", value: 5 }],
};

const elmo: Equipment = {
  id: "elmo",
  name: "Elmo",
  description: "",
  rarity: "common",
  value: 10,
  slot: "helmet",
  modifiers: [{ stat: "defense", value: 3 }],
};

describe("equip / unequip", () => {
  it("equipa um item no slot", () => {
    const { loadout, previous } = equip(createLoadout(), espada);
    expect(loadout.weapon).toBe(espada);
    expect(previous).toBeUndefined();
  });

  it("devolve o item anterior ao trocar no mesmo slot", () => {
    const first = equip(createLoadout(), espada).loadout;
    const { loadout, previous } = equip(first, espadaMelhor);
    expect(loadout.weapon).toBe(espadaMelhor);
    expect(previous).toBe(espada);
  });

  it("desequipa um slot e devolve o item", () => {
    const equipped = equip(createLoadout(), espada).loadout;
    const { loadout, previous } = unequip(equipped, "weapon");
    expect(loadout.weapon).toBeUndefined();
    expect(previous).toBe(espada);
  });

  it("não muta o loadout original", () => {
    const base = createLoadout();
    equip(base, espada);
    expect(base.weapon).toBeUndefined();
  });
});

describe("bônus de atributo", () => {
  it("lista os itens equipados em slots distintos", () => {
    let loadout = equip(createLoadout(), espada).loadout;
    loadout = equip(loadout, elmo).loadout;
    expect(getEquippedItems(loadout)).toHaveLength(2);
  });

  it("soma os modificadores de um atributo", () => {
    let loadout = equip(createLoadout(), espada).loadout; // strength +2
    loadout = equip(loadout, elmo).loadout; // defense +3
    expect(getStatBonus(loadout, "strength")).toBe(2);
    expect(getStatBonus(loadout, "defense")).toBe(3);
    expect(getStatBonus(loadout, "speed")).toBe(0);
  });
});
