import type { Location, Region } from "../../types";
import { darkWoodsKnowledge } from "../knowledge";

/**
 * Locais (POIs) do Bosque Sombrio — o grafo de descoberta da Região 1.
 *
 * Coordenadas (`coord`) são data-driven e definem o layout do mapa espacial
 * (T067). Conexões formam o grafo; `requirements` são gates por conhecimento.
 *
 * Fluxo desenhado: a Vila revela Estrada/Caçador/Mercador. O Caçador dá o
 * contexto (e inicia a investigação). Estrada→Bosque→Ruínas; as Ruínas
 * revelam a entrada da Cripta (conhecimento `crypt_entrance`), que destrava a
 * Cripta e, por fim, o Necromante.
 */
const locations: readonly Location[] = [
  {
    id: "village",
    name: "name.loc.village",
    icon: "🏰",
    type: "village",
    coord: { col: 1, row: 0 },
    connections: ["road", "hunter", "merchant"],
    content: { kind: "empty" },
    description: "loc.village.desc",
  },
  {
    id: "road",
    name: "name.loc.road",
    icon: "🛣️",
    type: "road",
    coord: { col: 3, row: 0 },
    connections: ["village", "woods"],
    content: { kind: "combat", enemyId: "goblin" },
    description: "loc.road.desc",
  },
  {
    id: "hunter",
    name: "name.loc.hunter",
    icon: "🧙",
    type: "npc",
    coord: { col: 0, row: 2 },
    connections: ["village"],
    content: { kind: "npc", npcId: "hunter" },
    description: "loc.hunter.desc",
  },
  {
    id: "merchant",
    name: "name.loc.merchant",
    icon: "💰",
    type: "shop",
    coord: { col: 1, row: 2 },
    connections: ["village"],
    content: { kind: "shop", shopId: "general" },
    description: "loc.merchant.desc",
  },
  {
    id: "woods",
    name: "name.loc.woods",
    icon: "🌲",
    type: "woods",
    coord: { col: 3, row: 2 },
    connections: ["road", "ruins"],
    content: { kind: "combat", enemyId: "wolf" },
    description: "loc.woods.desc",
  },
  {
    id: "ruins",
    name: "name.loc.ruins",
    icon: "🏚️",
    type: "ruins",
    coord: { col: 3, row: 3 },
    connections: ["woods", "crypt"],
    content: { kind: "lore", knowledgeId: "crypt_entrance" },
    description: "loc.ruins.desc",
  },
  {
    id: "crypt",
    name: "name.loc.crypt",
    icon: "🪦",
    type: "crypt",
    coord: { col: 3, row: 4 },
    connections: ["ruins", "necromancer"],
    requirements: { knowledge: ["crypt_entrance"] },
    content: { kind: "combat", enemyId: "skeleton" },
    description: "loc.crypt.desc",
  },
  {
    id: "necromancer",
    name: "name.loc.necromancer",
    icon: "👑",
    type: "boss",
    coord: { col: 3, row: 5 },
    connections: ["crypt"],
    requirements: { knowledge: ["crypt_entrance"] },
    content: { kind: "boss", bossId: "forest_necromancer" },
    description: "loc.necromancer.desc",
  },
];

/** Bosque Sombrio — primeira região explorada como grafo de descoberta. */
export const darkWoods: Region = {
  id: "dark_woods",
  name: "name.dark_woods",
  minLevel: 1,
  maxLevel: 6,
  enemyPool: ["goblin", "wolf", "skeleton"],
  bossId: "forest_necromancer",
  entryLocationId: "village",
  locations,
  knowledge: darkWoodsKnowledge,
};
