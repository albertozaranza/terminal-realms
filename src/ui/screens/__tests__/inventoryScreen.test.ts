import { describe, expect, it } from "vitest";
import { WarriorClass } from "../../../classes";
import { rustySword, smallPotion } from "../../../content";
import { createCharacter } from "../../../core";
import { equip } from "../../../systems";
import type { InventorySlot, Player } from "../../../types";
import { t } from "../../../utils";
import { renderInventoryScreen } from "../inventoryScreen";

describe("renderInventoryScreen", () => {
  const player: Player = createCharacter({ name: "Hero", characterClass: new WarriorClass() });
  // Mochila com o consumível empilhado e a arma (nome completo, não truncado).
  const items: InventorySlot[] = [
    { item: smallPotion, quantity: 3 },
    { item: rustySword, quantity: 1 },
  ];
  const loadout = equip({}, rustySword).loadout;

  it("renders the equipment slot labels (paper-doll)", () => {
    const out = renderInventoryScreen({ player, loadout, items, gold: 42 }, 60);
    expect(out).toContain(t("slot.weapon"));
    expect(out).toContain(t("slot.helmet"));
    expect(out).toContain(t("slot.boots"));
  });

  it("shows the backpack contents (full names), status and gold", () => {
    const out = renderInventoryScreen({ player, loadout: {}, items, gold: 42 }, 60);
    expect(out).toContain(t("name.rusty_sword"));
    expect(out).toContain(t("name.small_potion"));
    expect(out).toContain("3×");
    expect(out).toContain("42");
    expect(out).toContain(t("inventory.hp", { hp: player.hp, maxHp: player.maxHp }));
  });

  it("shows the equipped item in its slot (name may be truncated)", () => {
    const out = renderInventoryScreen({ player, loadout, items: [], gold: 0 }, 60);
    // O slot pode truncar o nome longo; o prefixo deve aparecer.
    expect(out).toContain("Espada Enferr");
  });

  it("shows an empty-backpack notice when there are no items", () => {
    const out = renderInventoryScreen({ player, loadout: {}, items: [], gold: 0 }, 60);
    expect(out).toContain(t("inventory.emptyBackpack"));
  });
});
