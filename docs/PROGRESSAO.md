# Design de Progressão & Diversidade de Inimigos

> **Documento de design (T057).** Define a direção da progressão de
> médio/longo prazo antes de implementar. Nenhuma implementação deve começar
> sem este design aprovado. Gera tasks de backlog (FASE 15).

---

## Problema

O jogo permite evoluir até o **nível 50** ([core/config.ts](../src/core/config.ts) `MAX_LEVEL`), com curva de XP exponencial leve (`100 * level^1.5`). Porém o conteúdo de inimigos é raso:

| Inimigo | Nível | HP | ATK | DEF | XP |
| ------- | ----- | -- | --- | --- | -- |
| Goblin | 1 | 25 | 5 | 2 | 20 |
| Lobo | 2 | 30 | 6 | 2 | 25 |
| Esqueleto | 3 | 35 | 7 | 3 | 30 |
| Orc | 4 | 50 | 10 | 4 | 45 |
| Rei Goblin (chefe) | 5 | 120 | 14 | 6 | 200 |

Existe **uma única região** (Campos Iniciais, `minLevel 1 / maxLevel 5`) e o jogo termina ao derrotar o chefe. Resultado:

- Depois do nível ~5 não há **desafio** (inimigos ficam triviais).
- Não há **variedade** nova para sustentar 50 níveis.
- O teto de progressão (Lv 50) é inalcançável/sem propósito com o conteúdo atual.

---

## Objetivos de design

1. Tornar o desafio **contínuo** — inimigos relevantes em qualquer nível do jogador.
2. Dar **variedade** (novos inimigos, regiões e chefes) para a jornada longa.
3. Manter a engine **data-driven** (CLAUDE.md): adicionar conteúdo sem tocar na engine.
4. Preservar o **balanceamento** (curva de XP/recompensa coerente até Lv 50).

---

## Abordagens consideradas

### A. Escalonamento dinâmico por nível

Os stats do inimigo escalam em função do nível do jogador (ou da região), via uma função pura `scaleEnemy(template, level)`.

- **Prós:** desafio contínuo com pouco conteúdo novo; reaproveita os inimigos atuais.
- **Contras:** pode parecer artificial ("mesmo goblin com mais HP"); risco de "esponja de dano" se a fórmula for ruim.

### B. Faixas de nível por conteúdo (tiers)

Criar novos inimigos data-driven em faixas (Lv 5–10, 10–20, …), cada região com seu `enemyPool` e `minLevel/maxLevel`.

- **Prós:** variedade real (arte, nomes, comportamento); encaixa com **T047** (novas regiões) e **T048** (novos chefes).
- **Contras:** exige bastante conteúdo para cobrir 50 níveis; muito trabalho manual.

### C. Híbrido (recomendado)

Regiões definem **faixas de nível** e um **pool temático** de inimigos (B); dentro da faixa, um **escalonamento leve** (A) ajusta os stats ao nível do jogador para suavizar as transições. Chefes por região (T048) marcam o fim de cada faixa.

- **Prós:** equilibra variedade e custo; transições suaves; escala até Lv 50 sem precisar de 50 inimigos únicos.
- **Contras:** duas alavancas de balanceamento (curva + escala) exigem simulação.

> **Recomendação:** seguir **C (híbrido)**, começando pelo escalonamento (alavanca barata) e adicionando conteúdo/regiões incrementalmente.

---

## Esboço técnico (a detalhar nas tasks)

- `Region` ganha (ou passa a usar de fato) `minLevel`/`maxLevel` para selecionar/escalar inimigos.
- Função pura `scaleEnemy(base: Enemy, level: number): Enemy` em `core/` (testável sem UI), aplicada ao resolver o encontro em [game.ts](../src/game.ts) `nextEncounter`/`resolveCombat`.
- Curva de stats do inimigo (HP/ATK/DEF/XP) parametrizada por nível, validada com simulação `autoBattle` (já existe em balanceamento — T031).
- Novos inimigos/chefes/regiões como **dados** em `content/` (sem mudança na engine).
- Recompensas (XP, gold, loot) escalam com o nível do inimigo para manter a curva de Lv 50 saudável.

---

## Tasks de backlog geradas (FASE 15)

- **T057** — Este documento de design (concluído ao aprová-lo).
- **T058** — Estoque rotativo da loja por região (depende de múltiplas regiões).
- **T059** — Mapa de regiões no menu.
- **(novas) Escalonamento de inimigos** — `scaleEnemy` + integração no encontro.
- **(novas) Conteúdo por faixa** — novos inimigos Lv 5+ e ligação com **T047** (regiões) e **T048** (chefes).
- **(novas) Rebalanceamento** — revisar curva de XP/recompensa até Lv 50 com simulação.

---

## Decisões em aberto (para aprovar antes de implementar)

1. **Escala dinâmica vs. faixas fixas vs. híbrido** — recomendação: híbrido (C).
2. **Teto de nível** — manter Lv 50 ou reduzir para algo alcançável com o conteúdo planejado?
3. **Quantas regiões/faixas** no primeiro incremento (sugestão: +1 região Lv 5–10 com chefe próprio).
4. **Fim de jogo** — hoje termina no Rei Goblin; com mais regiões, o "fim" passa a ser o último chefe ou vira contínuo/endless?
