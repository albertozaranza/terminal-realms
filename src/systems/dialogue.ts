import type { Dialogue, DialogueEffect, DialogueNode, DialogueOption } from "../types";
import { t } from "../utils";
import { type DiscoveryContext, meetsRequirement } from "./discovery";

/**
 * Sistema de diálogo (puro). Percorre a árvore de um NPC e devolve os efeitos
 * de cada escolha para o orquestrador aplicar ao estado — o diálogo em si não
 * conhece o `GameState`. Opções podem ser gated por conhecimento/nível/item.
 */

/** Nó de diálogo pelo id (undefined se não existir). */
export function getNode(dialogue: Dialogue, nodeId: string): DialogueNode | undefined {
  return dialogue.nodes[nodeId];
}

/** Nó inicial do diálogo. Lança erro claro se o `start` não existir. */
export function getStartNode(dialogue: Dialogue): DialogueNode {
  const node = dialogue.nodes[dialogue.start];
  if (!node) {
    throw new Error(t("error.dialogue.missingStart", { dialogue: dialogue.id }));
  }
  return node;
}

/** Opções visíveis em um nó, respeitando os gates (`requires`). */
export function availableOptions(node: DialogueNode, context: DiscoveryContext): DialogueOption[] {
  return node.options.filter((option) => meetsRequirement(option.requires, context));
}

/** Resultado de escolher uma opção: efeitos a aplicar e o próximo nó (se houver). */
export interface DialogueStep {
  /** Efeitos a aplicar ao estado (revelar local, conhecimento, loja, combate). */
  effects?: DialogueEffect;
  /** Próximo nó da conversa; ausente encerra o diálogo. */
  nextNode?: DialogueNode;
  /** Indica que a conversa terminou. */
  ends: boolean;
}

/**
 * Resolve a escolha de uma opção: retorna os efeitos e o próximo nó. A
 * conversa termina quando a opção não tem `goto` (ou aponta para um nó
 * inexistente).
 */
export function chooseOption(dialogue: Dialogue, option: DialogueOption): DialogueStep {
  const nextNode = option.goto ? dialogue.nodes[option.goto] : undefined;
  return {
    effects: option.effects,
    nextNode,
    ends: nextNode === undefined,
  };
}
