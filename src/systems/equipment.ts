import type { Equipment, EquipmentSlot, Inventory, Loadout, Player, StatKey } from "../types";
import { t } from "../utils";
import { addItem, removeItem } from "./inventory";
import { isEquipment } from "./itemGuards";

/**
 * Sistema de equipamentos — funções puras que retornam um novo Loadout
 * sem mutar o original.
 */

/** Resultado de equipar/desequipar: novo loadout e o item que estava no slot. */
export interface EquipResult {
  loadout: Loadout;
  previous?: Equipment;
}

/** Cria um loadout vazio. */
export function createLoadout(): Loadout {
  return {};
}

/** Equipa um item no seu slot, devolvendo o que estava equipado (se houver). */
export function equip(loadout: Loadout, equipment: Equipment): EquipResult {
  const previous = loadout[equipment.slot];
  return {
    loadout: { ...loadout, [equipment.slot]: equipment },
    previous,
  };
}

/** Desequipa o item de um slot, devolvendo-o (se houver). */
export function unequip(loadout: Loadout, slot: EquipmentSlot): EquipResult {
  const { [slot]: previous, ...rest } = loadout;
  return { loadout: rest, previous };
}

/** Itens atualmente equipados. */
export function getEquippedItems(loadout: Loadout): Equipment[] {
  return Object.values(loadout).filter((item): item is Equipment => item !== undefined);
}

/** Soma dos modificadores de um atributo entre todos os equipamentos. */
export function getStatBonus(loadout: Loadout, stat: StatKey): number {
  return getEquippedItems(loadout)
    .flatMap((item) => item.modifiers)
    .filter((modifier) => modifier.stat === stat)
    .reduce((total, modifier) => total + modifier.value, 0);
}

/** Inventário e equipamentos vestidos — alvo das transições de equipar. */
export interface EquipState {
  inventory: Inventory;
  loadout: Loadout;
}

/**
 * Equipa, no slot correspondente, um equipamento que está na mochila:
 * remove uma unidade do inventário, veste a peça e devolve à mochila o
 * que estava no slot (se houver). Função pura.
 *
 * Lança erro se o item não existir no inventário ou não for equipável.
 */
export function equipFromInventory(state: EquipState, itemId: string): EquipState {
  const slot = state.inventory.items.find((entry) => entry.item.id === itemId);
  if (!slot) {
    throw new Error(t("error.inventory.itemNotFound", { itemId }));
  }
  if (!isEquipment(slot.item)) {
    throw new Error(t("error.equipment.notEquippable", { itemId }));
  }

  let inventory = removeItem(state.inventory, itemId);
  const { loadout, previous } = equip(state.loadout, slot.item);
  if (previous) {
    inventory = addItem(inventory, previous);
  }
  return { inventory, loadout };
}

/**
 * Desequipa um slot, devolvendo a peça (se houver) à mochila. Função pura;
 * se o slot estiver vazio, o estado é devolvido inalterado.
 */
export function unequipToInventory(state: EquipState, slot: EquipmentSlot): EquipState {
  const { loadout, previous } = unequip(state.loadout, slot);
  const inventory = previous ? addItem(state.inventory, previous) : state.inventory;
  return { inventory, loadout };
}

/**
 * Aplica os bônus do loadout aos atributos de um jogador, devolvendo uma
 * cópia "efetiva" para uso em combate. Os recursos atuais (hp/mana) são
 * preservados; apenas os atributos e máximos recebem os modificadores.
 *
 * Função pura — não altera o jogador-base. O jogador persistido deve
 * continuar com os atributos-base; os bônus são recalculados a cada combate.
 */
export function applyLoadoutToPlayer(player: Player, loadout: Loadout): Player {
  return {
    ...player,
    maxHp: player.maxHp + getStatBonus(loadout, "maxHp"),
    maxMana: player.maxMana + getStatBonus(loadout, "maxMana"),
    strength: player.strength + getStatBonus(loadout, "strength"),
    dexterity: player.dexterity + getStatBonus(loadout, "dexterity"),
    intelligence: player.intelligence + getStatBonus(loadout, "intelligence"),
    defense: player.defense + getStatBonus(loadout, "defense"),
    speed: player.speed + getStatBonus(loadout, "speed"),
  };
}
