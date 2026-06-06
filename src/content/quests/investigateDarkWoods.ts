import type { Quest } from "../../types";

/**
 * Missão de investigação do Bosque Sombrio. Não é "mate N goblins": progride
 * por descoberta (conhecer o necromante, achar a entrada da cripta) e culmina
 * no confronto com o chefe.
 */
export const investigateDarkWoods: Quest = {
  id: "investigate_dark_woods",
  name: "quest.investigate_dark_woods.name",
  description: "quest.investigate_dark_woods.description",
  status: "active",
  regionId: "dark_woods",
  objectives: [
    {
      id: "learn_necromancer",
      description: "quest.investigate_dark_woods.obj.necromancer",
      knowledgeId: "necromancer_seen",
    },
    {
      id: "find_entrance",
      description: "quest.investigate_dark_woods.obj.entrance",
      knowledgeId: "crypt_entrance",
    },
    {
      id: "defeat_necromancer",
      description: "quest.investigate_dark_woods.obj.boss",
      locationId: "necromancer",
    },
  ],
};
