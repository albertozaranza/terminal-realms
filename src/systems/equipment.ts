import type { Equipment, EquipmentSlot, Loadout, Player, StatKey } from "../types";

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
