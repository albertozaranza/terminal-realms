import type { DiscoveryRequirement } from "./Location";

/**
 * Efeitos disparados ao escolher uma opção de diálogo. São retornados ao
 * orquestrador (game loop), que os aplica ao estado — o diálogo em si é puro.
 */
export interface DialogueEffect {
  /** Revela um local na região. */
  revealLocation?: string;
  /** Concede um conhecimento (entra no diário). */
  grantKnowledge?: string;
  /** Inicia/ativa uma missão. */
  startQuest?: string;
  /** Abre uma loja (id). */
  openShop?: string;
  /** Inicia combate com um inimigo (id). */
  startCombat?: string;
}

/** Opção selecionável em um nó de diálogo. */
export interface DialogueOption {
  /** Chave i18n do texto da opção. */
  text: string;
  /** Efeitos aplicados ao escolher a opção. */
  effects?: DialogueEffect;
  /** Id do próximo nó (undefined encerra a conversa). */
  goto?: string;
  /** Requisito para a opção aparecer/ficar habilitada. */
  requires?: DiscoveryRequirement;
}

/** Nó da árvore de diálogo (uma fala do NPC + opções de resposta). */
export interface DialogueNode {
  id: string;
  /** Chave i18n da fala do NPC. */
  text: string;
  options: readonly DialogueOption[];
}

/** Árvore de diálogo de um NPC. Data-driven em content/. */
export interface Dialogue {
  id: string;
  /** Id do nó inicial. */
  start: string;
  nodes: Readonly<Record<string, DialogueNode>>;
}
