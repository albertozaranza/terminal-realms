import type { Consumable, Player } from "../types";

/**
 * Aplica o efeito de um consumível a um jogador, devolvendo uma cópia com
 * HP/Mana recuperados (limitados aos máximos). Função pura — não consome o
 * item do inventário (isso cabe ao chamador via `removeItem`).
 */
export function useConsumable(player: Player, consumable: Consumable): Player {
  const hp = consumable.effect.hp
    ? Math.min(player.maxHp, player.hp + consumable.effect.hp)
    : player.hp;
  const mana = consumable.effect.mana
    ? Math.min(player.maxMana, player.mana + consumable.effect.mana)
    : player.mana;
  return { ...player, hp, mana };
}
