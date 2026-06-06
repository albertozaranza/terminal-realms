import type { Enemy } from "../../types";

/**
 * Necromante da Floresta — chefe do Bosque Sombrio (FASE 16). Só é alcançado
 * após o jogador descobrir a entrada da cripta e atravessá-la.
 */
export const forestNecromancer: Enemy = {
  id: "forest_necromancer",
  name: "name.forest_necromancer",
  level: 6,
  hp: 140,
  attack: 16,
  defense: 7,
  experienceReward: 260,
  lootTableId: "forest_necromancer",
};
