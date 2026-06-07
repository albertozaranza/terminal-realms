# TASKS.md

# Terminal Realms Development Roadmap

Este documento define a ordem oficial de implementação.

O Claude deve executar as tarefas sequencialmente.

Não iniciar uma tarefa antes da anterior estar concluída e funcional.

---

# Status do Projeto

| Fase | Escopo | Status |
| ---- | ------ | ------ |
| 1 — Foundation | T001–T005 | ✅ Concluída |
| 2 — Core Game | T006–T010 | ✅ Concluída |
| 3 — Combate | T011–T015 | ✅ Concluída |
| 4 — Conteúdo Inicial | T016–T018 | ✅ Concluída |
| 5 — Loot e Equipamentos | T019–T022 | ✅ Concluída |
| 6 — Exploração | T023–T025 | ✅ Concluída |
| 7 — Interface | T026–T028 | ✅ Concluída |
| 8 — Persistência | T029–T030 | ✅ Concluída |
| 9 — MVP Release | T031–T033 | ✅ Concluída |
| 10 — Internacionalização (i18n) | T034–T038 | ✅ Concluída |
| 11 — Refinamentos Técnicos | T039–T042 | 🗄️ Backlog |
| 12 — Roadmap Futuro | T043–T049 | 🗄️ Backlog |
| 13 — Overhaul de UI (TUI) | T050 | ✅ Concluída |
| 14 — Economia, Itens e Equipamento | T051–T056 | ✅ Concluída |
| 15 — Progressão & Diversidade | T057–T059 | 🗄️ Backlog |
| 16 — Mundo por Descoberta | T060–T072 | ✅ Concluída |

O histórico detalhado de conclusão e as decisões técnicas ficam em [PROGRESS.md](PROGRESS.md).

---

# FASE 1 — FOUNDATION — ✅ CONCLUÍDA

Objetivo: criar a base técnica do projeto.

---

## T001 - Inicializar Projeto

### Objetivos

- Criar projeto Node.js
- Configurar TypeScript
- Configurar scripts yarn

### Critérios de Aceite

- `yarn install` funciona
- `yarn build` funciona
- `yarn start` funciona

---

## T002 - Estrutura de Diretórios

### Objetivos

Criar estrutura:

```text
src/
├── core/
├── classes/
├── systems/
├── content/
├── ui/
├── types/
├── utils/
```

### Critérios de Aceite

- Estrutura criada
- Imports funcionando

---

## T003 - Definir Tipos Base

### Objetivos

Criar:

- Entity
- Player
- Enemy
- Item
- Skill
- Region
- Quest

### Critérios de Aceite

- Todos os tipos compilam

---

## T004 - Sistema de Configuração

### Objetivos

Criar constantes globais.

Exemplos:

```typescript
MAX_LEVEL;
SAVE_FILE;
START_REGION;
```

### Critérios de Aceite

- Config centralizada

---

## T005 - Utilitários

### Objetivos

Criar:

- random
- dice
- math

### Critérios de Aceite

- Testados
- Reutilizáveis

---

# FASE 2 — CORE GAME — ✅ CONCLUÍDA

Objetivo: criar a engine principal.

---

## T006 - GameState

### Objetivos

Implementar estado global.

### Critérios de Aceite

- Estado inicial válido

---

## T007 - GameEngine

### Objetivos

Implementar loop principal.

### Critérios de Aceite

- Inicia corretamente

---

## T008 - Sistema de Classes

### Objetivos

Criar:

- Warrior
- Archer
- Mage

### Critérios de Aceite

- Todas implementam CharacterClass

---

## T009 - Criação de Personagem

### Objetivos

Permitir:

- Escolha de nome
- Escolha de classe

### Critérios de Aceite

- Personagem criado com sucesso

---

## T010 - Sistema de Experiência

### Objetivos

Implementar:

- ganho de XP
- level up

### Critérios de Aceite

- Evolução funcional

---

# FASE 3 — COMBATE — ✅ CONCLUÍDA

Objetivo: combate completo e jogável.

---

## T011 - CombatEngine

### Objetivos

Criar engine de combate.

### Critérios de Aceite

- Combate inicia e termina

---

## T012 - Ataque Básico

### Objetivos

Implementar:

- ataque jogador
- ataque inimigo

### Critérios de Aceite

- HP reduz corretamente

---

## T013 - Sistema de Turnos

### Objetivos

Implementar turnos.

### Critérios de Aceite

- Alternância correta

---

## T014 - Sistema de Habilidades

### Objetivos

Implementar skills.

### Critérios de Aceite

- Cooldowns funcionam

---

## T015 - Vitória e Derrota

### Objetivos

Implementar encerramento de combate.

### Critérios de Aceite

- Resultado correto

---

# FASE 4 — CONTEÚDO INICIAL — ✅ CONCLUÍDA

Objetivo: fornecer conteúdo suficiente para jogar.

---

## T016 - Monstros Básicos

### Objetivos

Criar:

- Goblin
- Lobo
- Esqueleto
- Orc

### Critérios de Aceite

- Todos aparecem em combate

---

## T017 - Região Inicial

### Objetivos

Criar:

Campos Iniciais

### Critérios de Aceite

- Exploração possível

---

## T018 - Chefe Inicial

### Objetivos

Criar:

Rei Goblin

### Critérios de Aceite

- Combate funcional

---

# FASE 5 — LOOT E EQUIPAMENTOS — ✅ CONCLUÍDA

Objetivo: progressão baseada em itens.

---

## T019 - Sistema de Itens

### Objetivos

Criar estrutura de itens.

### Critérios de Aceite

- Itens podem existir no inventário

---

## T020 - Inventário

### Objetivos

Criar InventorySystem.

### Critérios de Aceite

- Adicionar e remover itens

---

## T021 - Equipamentos

### Objetivos

Implementar slots.

### Critérios de Aceite

- Equipar e desequipar

---

## T022 - Loot Tables

### Objetivos

Implementar drop aleatório.

### Critérios de Aceite

- Itens dropam corretamente

---

# FASE 6 — EXPLORAÇÃO — ✅ CONCLUÍDA

Objetivo: criar o loop principal.

---

## T023 - WorldEngine

### Objetivos

Criar sistema de exploração.

### Critérios de Aceite

- Jogador consegue avançar

---

## T024 - Eventos Aleatórios

### Objetivos

Criar:

- Baú
- Emboscada
- Mercador

### Critérios de Aceite

- Eventos aparecem aleatoriamente

---

## T025 - Sistema de Regiões

### Objetivos

Implementar troca de regiões.

### Critérios de Aceite

- Progressão possível

---

# FASE 7 — INTERFACE — ✅ CONCLUÍDA

Objetivo: tornar o jogo agradável.

---

## T026 - Menu Principal

### Objetivos

Criar:

- Novo jogo
- Continuar
- Sair

### Critérios de Aceite

- Navegação funcional

---

## T027 - HUD

### Objetivos

Exibir:

- HP
- Mana
- XP
- Nível

### Critérios de Aceite

- Atualização em tempo real

---

## T028 - ANSI Art

### Objetivos

Criar arte para:

- Logo
- Classes
- Chefes

### Critérios de Aceite

- Renderização correta

---

# FASE 8 — PERSISTÊNCIA — ✅ CONCLUÍDA

Objetivo: salvar progresso.

---

## T029 - SaveSystem

### Objetivos

Salvar jogo.

### Critérios de Aceite

- Save criado

---

## T030 - LoadSystem

### Objetivos

Carregar jogo.

### Critérios de Aceite

- Estado restaurado corretamente

---

# FASE 9 — MVP RELEASE — ✅ CONCLUÍDA

Objetivo: versão jogável.

---

## T031 - Balanceamento Inicial

### Objetivos

Ajustar:

- dano
- XP
- loot

### Critérios de Aceite

- Progressão consistente

---

## T032 - Polimento

### Objetivos

Corrigir bugs.

### Critérios de Aceite

- Sem erros críticos

---

## T033 - Release MVP

### Objetivos

Gerar versão estável.

### Critérios de Aceite

- Jogável do início ao primeiro chefe

---

# FASE 10 — INTERNACIONALIZAÇÃO (i18n) — ✅ CONCLUÍDA

Objetivo: remover português dos identificadores e permitir o jogo em múltiplos idiomas (pt-BR padrão e en), com erros e exceções seguindo o idioma escolhido.

Decisões de refinamento:

- O motor de i18n vive em `utils/` (camada base, sem dependências) para ser acessível por todas as camadas, inclusive nos lançamentos de erro.
- Idiomas suportados no MVP: `pt-BR` (padrão) e `en`.
- IDs de conteúdo e identificadores de código em inglês; nomes exibidos vêm do catálogo de traduções.

---

## T034 - Sistema de i18n (Translation)

### Objetivos

- Criar utilitário de i18n com catálogos `pt-BR` e `en`
- `t(key, params)` com interpolação de parâmetros
- `getLanguage` / `setLanguage` com idioma padrão

### Critérios de Aceite

- `t()` retorna a string do idioma atual, com fallback para `pt-BR` e para a própria chave
- Idioma alternável programaticamente

---

## T035 - Identificadores em Inglês

### Objetivos

- Renomear variáveis, funções, constantes e nomes de arquivo de pt-BR para inglês
- Renomear IDs de conteúdo (strings) para inglês

### Critérios de Aceite

- Nenhum identificador ou arquivo em pt-BR no código de `src/`
- Build e testes passam

---

## T036 - Erros e Exceções via i18n

### Objetivos

- Mover as mensagens de erro para o catálogo i18n (`pt-BR` e `en`)
- Lançar erros usando `t()`

### Critérios de Aceite

- As mensagens de erro seguem o idioma atual

---

## T037 - Seleção de Idioma pelo Usuário

### Objetivos

- Permitir trocar o idioma pela UI (menu)
- UI e mensagens (incluindo erros) seguem o idioma escolhido
- Persistir o idioma no save

### Critérios de Aceite

- Trocar o idioma altera a UI e o idioma de erros/exceções
- O idioma escolhido é restaurado ao carregar o save

---

## T038 - Padronização e Isolamento dos Testes

### Objetivos

- Traduzir as descrições (`describe`/`it`) dos testes para inglês
- Isolar os testes em uma pasta `__tests__/` em cada caminho

### Critérios de Aceite

- Todas as descrições de teste em inglês
- Cada teste vive em `__tests__/` no seu respectivo path
- Testes continuam passando

---

# FASE 11 — REFINAMENTOS TÉCNICOS — 🗄️ BACKLOG (não implementar agora)

Pontos levantados durante o MVP. Não implementar nesta etapa.

---

## T039

Efeito numérico das habilidades em combate.

Hoje `Skill.execute()` retorna efeito neutro. Aplicar dano/cura reais exige enriquecer o contrato `Skill`/combate (mudança arquitetural a propor antes).

---

## T040 — ✅ CONCLUÍDA (via T051)

Unificar `Player.inventory` e `GameState.inventory`.

Remover a redundância prevista no ARCHITECTURE, definindo um inventário canônico.

Concluída na FASE 14: `GameState.inventory` é o canônico e `Player.inventory` foi removido.

---

## T041

Alinhar o roster da Região 1 ao CONTENT_BIBLE.

Hoje os Campos Iniciais usam Goblin/Lobo/Esqueleto/Orc; o CONTENT_BIBLE define Rato Gigante, Goblin, Lobo e Bandido.

---

## T042

Revisar os escopos de commit do commitlint.

Decidir se o escopo deve aceitar apenas `T###` ou continuar permitindo escopos de infra (`tooling`, `docs`, etc.).

---

# FASE 12 — ROADMAP FUTURO — 🗄️ BACKLOG

Não implementar nesta etapa.

---

## T043

Crafting

---

## T044

Missões secundárias

---

## T045

Mercadores avançados

---

## T046

Sistema de reputação

---

## T047

Novas regiões

- Floresta Sombria
- Montanhas Congeladas
- Pântano Maldito
- Terras Infernais

---

## T048

Novos chefes

---

## T049

Modo Hardcore

---

# FASE 13 — OVERHAUL DE UI (TUI) — ✅ CONCLUÍDA

Objetivo: transformar a interface em uma aplicação de terminal de tela
cheia (TUI). Sem alterar regras de negócio
(combate, progressão, XP, loot, classes, save) — apenas UI, renderização,
ANSI art, menus e feedback visual.

---

## T050 - Renderização baseada em estado + ANSI art

### Objetivos

- `GameRenderer` que limpa e redesenha a tela inteira a cada mudança de
  estado (sem acumular log, sem scroll); painel de histórico limitado.
- Telas dedicadas: menu, criação de personagem (galeria de classes),
  exploração (faixa temática da região), combate (arte do inimigo/chefe
  + barras coloridas), vitória e game over.
- ANSI art para inimigos (goblin, lobo, esqueleto, orc) e chefe maior,
  artes de classe e temas de região; barras coloridas por limiar.
- Componentes reutilizáveis: `panel`, `center`, `columns`, `divider`,
  `coloredBar`, `renderLogPanel`.

### Critérios de Aceite

- A interface não cresce indefinidamente nem exige scroll.
- O usuário enxerga apenas o estado atual do jogo.
- Sem alterar a lógica de jogo; `tsc`, Biome, testes e build passam.

---

# FASE 14 — ECONOMIA, ITENS E EQUIPAMENTO — ✅ CONCLUÍDA

Objetivo: dar utilidade ao ouro e ao inventário — corrigir a contagem de
drops, exibir e usar itens, equipar equipamento e abrir uma loja onde o ouro
é gasto. Decisões consolidadas no plano de desenvolvimento desta fase.

Pré-requisito de leitura: CLAUDE.md, ARCHITECTURE.md, GDD.md, CONTENT_BIBLE.md.

---

## T051 - Unificar Inventário (conclui T040)

### Objetivos

- Eleger `GameState.inventory` como inventário canônico.
- Remover o campo redundante `Player.inventory` (nunca atualizado).
- HUD/telas passam a refletir a contagem e os itens reais.

### Critérios de Aceite

- Itens dropados em combate aparecem na contagem do HUD.
- Nenhuma referência remanescente a `Player.inventory`.
- T040 marcado como concluído.

---

## T052 - Itens Empilháveis

### Objetivos

- Agrupar itens iguais por quantidade (ex.: "Poção Pequena x3").
- Stack vale para consumíveis; equipamento permanece instância individual.
- Persistir o novo formato no save (migração/compatibilidade).

### Critérios de Aceite

- Adicionar item repetido incrementa a quantidade, não duplica entradas.
- Save/load preservam quantidades.
- `addItem`/`removeItem` e testes cobrem o novo contrato.

---

## T053 - Tela de Inventário (estilo Tibia)

### Objetivos

- Tela dedicada no **layout paper-doll do Tibia**: silhueta com slots de
  equipamento posicionados ao redor do corpo (capacete, amuleto, mochila,
  arma/mão, peito, anel, calças/botas) + grade da mochila com os itens, e o
  ouro exibido na parte inferior.
- Renderizar slots vazios e ocupados de forma distinta (ANSI/boxen).
- **Interação de equipar/desequipar** (continuação da T055): selecionar um
  equipamento da mochila o veste no slot; selecionar um slot ocupado o
  devolve à mochila.
- Acessível a partir do menu de exploração.

### Critérios de Aceite

- Abrir a tela mostra o conteúdo real do inventário e os slots equipados.
- O layout remete ao inventário do Tibia (slots ao redor + mochila + ouro).
- Equipar/desequipar pela tela atualiza `loadout` e inventário coerentemente.
- Camada de UI sem lógica de jogo (apenas renderização + IO).

---

## T054 - Usar Consumíveis

### Objetivos

- `useConsumable(player, item)` puro aplicando `effect` (hp/mana), com clamp nos máximos.
- Uso fora do combate (tela de inventário) e dentro do combate (nova ação "item", consome o turno).

### Critérios de Aceite

- Usar poção recupera HP/mana sem ultrapassar o máximo e consome a unidade.
- A ação "item" aparece no menu de combate e gasta o turno.
- Lógica testável sem interface.

---

## T055 - Equipar Equipamento (fundação)

> Ordem: executada **antes** da T053, pois a tela paper-doll consome o
> `loadout`. A **interação** de equipar/desequipar (clicar num slot) é
> implementada junto da tela na T053.

### Objetivos

- Adicionar `loadout` ao `GameState` e persistir no save.
- Aplicar os bônus do loadout aos atributos do jogador no combate
  (`applyLoadoutToPlayer`), sem corromper os atributos-base persistidos.

### Critérios de Aceite

- Equipar altera os atributos efetivos do jogador no combate.
- Save/load preservam o loadout (inclusive saves antigos, com default vazio).
- Sem código morto: o sistema de equipamento passa a ser usado de fato.

---

## T056 - Loja / Comerciante

### Objetivos

- `systems/shop.ts` puro: `buyItem` (valida saldo e requisito de nível) e `sellItem` (paga fração do `value`).
- Estoque data-driven (`content/shops/`): loja fixa + itens exclusivos do merchant aleatório.
- Opção "Loja" fixa no menu de exploração e ligação do evento `merchant` ao encontro aleatório.
- `shopScreen.ts` + `GameIO.shop(...)`; i18n em en/ptBR.

### Critérios de Aceite

- Comprar reduz o ouro e adiciona o item; bloqueado abaixo do nível exigido.
- Vender remove o item e credita fração do valor.
- O merchant aleatório oferece itens exclusivos não vendidos na loja fixa.

---

# FASE 15 — PROGRESSÃO & DIVERSIDADE — 🗄️ BACKLOG (design antes de implementar)

## T057 — ✅ Design entregue (aguardando aprovação)

Documento de design de progressão: [PROGRESSAO.md](PROGRESSAO.md).

Hoje há níveis até 50, mas inimigos só vão a Lv1–4 (comuns) e Lv5 (boss). O
documento define abordagens (escalonamento dinâmico, faixas por região,
híbrido — recomendado), esboço técnico (`scaleEnemy`), curva de XP/recompensa
e integração com T047 (novas regiões) e T048 (novos chefes). A **implementação**
permanece em backlog até a aprovação das decisões em aberto do documento.

## T058

Estoque rotativo da loja por região (depende de mais de uma região).

## T059

Mapa de regiões no menu principal/exploração. **Absorvida pela FASE 16 (T070).**

---

# FASE 16 — MUNDO POR DESCOBERTA — ✅ CONCLUÍDA

Objetivo: substituir a exploração linear por um **grafo de locais (POIs)**
descoberto progressivamente — o "Mapa-Constelação". O jogador viaja
selecionando locais conhecidos (sem grid/WASD), e visitar locais, conversar
com NPCs e concluir missões revela novos locais, conhecimento e atalhos.
Decisões e histórico em [PROGRESS.md](PROGRESS.md).

Entregue como **fatia vertical na Região 1** (Bosque Sombrio). Combate, loot,
XP, classes e save mantêm as regras — ganharam um novo orquestrador de mundo
(mudança arquitetural aprovada: progressão linear → grafo de locais).

---

## T060 - Tipos do Mundo de Descoberta

### Objetivos

- Criar `Location` (POI: id, nome, ícone, tipo, `coord {col,row}`,
  `connections[]`, `requirements?`, `content`), `LocationState`,
  `LocationContent`, `NPC`, `Dialogue`/`DialogueNode`/`DialogueOption`/
  `DialogueEffect` e `Knowledge`.
- Estender `Region` (campos opcionais `entryLocationId`, `locations`,
  `knowledge`) e `Quest` (investigação: `regionId?`, `objectives?`) sem
  quebrar o conteúdo existente.

### Critérios de Aceite

- Todos os tipos compilam (`tsc`).
- `Region`/`Quest` permanecem compatíveis com o conteúdo atual (campos novos opcionais).

---

## T061 - GameState + Save/Migração

### Objetivos

- Adicionar ao `GameState`: `currentLocationId?`, `locationStates`
  (`Record<string, LocationState>`), `knowledge` (`string[]`) e `npcStates`.
- Migrar saves antigos com defaults seguros (sem quebrar compatibilidade).

### Critérios de Aceite

- Save/load preservam estado de descoberta, conhecimento e local atual.
- Saves antigos carregam com defaults (sem locais → fog total na entrada).

---

## T062 - systems/discovery.ts (puro)

### Objetivos

- Funções puras: revelar local, marcar concluído, `getReachableDestinations`,
  checagem de `requirements` (conhecimento/nível/item) e descoberta em cadeia
  (visitar um local revela seus vizinhos).

### Critérios de Aceite

- Lógica testável sem interface; cobertura dos estados e dos gates.

---

## T063 - systems/journal.ts (puro)

### Objetivos

- `addKnowledge`, `hasKnowledge` e consulta de fatos conhecidos/pendentes por região.

### Critérios de Aceite

- Conhecimento desbloqueia gates (testado sem interface).

---

## T064 - systems/dialogue.ts (puro)

### Objetivos

- Percorrer a árvore de diálogo e aplicar `effects` (revelar local, conceder
  conhecimento, iniciar missão, abrir loja, iniciar combate), retornando os
  efeitos para o orquestrador aplicar.

### Critérios de Aceite

- Opções gated por conhecimento; efeitos retornados corretamente (testado).

---

## T065 - core/WorldMapEngine

### Objetivos

- `travelTo(locationId)` resolve o conteúdo do local (combate/npc/evento/
  loja/boss/lore) e dispara as revelações de descoberta.
- Refatorar a exploração linear preservando o fallback para regiões sem grafo.

### Critérios de Aceite

- Navegação por grafo funcional; engine desacoplada de I/O e testável.

---

## T066 - Conteúdo: Região 1 como Grafo

### Objetivos

- Definir a Região 1 (Bosque Sombrio) como grafo: Vila Oakheart (entrada),
  Estrada, Caçador (NPC), Bosque, Ruínas, Cripta (🔒), Necromante (👑),
  mercador — com NPCs, diálogos, conhecimentos e missão de investigação.

### Critérios de Aceite

- Região jogável fim-a-fim (descoberta → investigação → desbloqueio → chefe).
- Conteúdo data-driven; nenhuma regra de negócio em `content/`.

---

## T067 - UI: Mapa da Região

### Objetivos

- `mapRender` + `mapScreen`: mapa espacial ASCII com fog, ícones por estado,
  🔒 com requisito, marcador "você está aqui" e legenda.

### Critérios de Aceite

- Mostra apenas o conhecido; cresce conforme a descoberta. UI sem lógica.

---

## T068 - UI: Diálogo de NPC

### Objetivos

- `dialogueScreen`: fala do NPC + opções numeradas + feedback de revelação.

### Critérios de Aceite

- Conversa navegável; revelações exibidas ao jogador.

---

## T069 - UI: Diário

### Objetivos

- `journalScreen`: conhecimentos da região (☑ conhecidos / ☐ pendentes).

### Critérios de Aceite

- Diário reflete o conhecimento real do jogador.

---

## T070 - UI: Mapa-Múndi de Regiões

### Objetivos

- Mapa de regiões conhecidas (ramificado), absorvendo a T059.

### Critérios de Aceite

- Mostra apenas regiões descobertas.

---

## T071 - Integração no Loop + i18n

### Objetivos

- `game.ts`: menu de exploração vira Mapa / Viajar / Diário / Inventário /
  Loja / Salvar; fia travel → conteúdo → combate/diálogo/evento/boss.
- i18n en/ptBR de todos os textos novos.

### Critérios de Aceite

- Jogável fim-a-fim pela nova navegação; erros/UI seguem o idioma.

---

## T072 - Polimento, Balanceamento e Docs

### Objetivos

- Arte ANSI por tipo de local, balanceamento, `yarn check`/`tsc`/`test:run`/
  `build` verdes; atualizar ARCHITECTURE/GDD/CONTENT_BIBLE/spec.

### Critérios de Aceite

- Sem regressões; documentação alinhada ao novo modelo de mundo.

---

# Regra Obrigatória

Antes de iniciar qualquer tarefa:

1. Ler CLAUDE.md
2. Ler ARCHITECTURE.md
3. Ler GDD.md

Toda implementação deve seguir esses documentos.

Nunca alterar a arquitetura para resolver uma tarefa específica.

Se uma tarefa exigir mudança arquitetural, a mudança deve ser proposta antes da implementação.

---

# Definition of Done (ao fechar uma task)

Toda task só é considerada concluída após, na ordem:

1. Implementação seguindo CLAUDE.md / ARCHITECTURE.md / GDD.md / CONTENT_BIBLE.md.
2. `yarn check` (Biome), `tsc --noEmit`, `yarn test:run` e `yarn build` passando.
3. **Registrar a conclusão e as decisões tomadas em [PROGRESS.md](PROGRESS.md)** (uma entrada por task).
4. Atualizar o **Status do Projeto** acima quando uma fase inteira for concluída.
5. Commit único da task no padrão `tipo(T###): descrição` (validado por commitlint/husky) e push.

Este passo 3 é obrigatório e faz parte do "fechar a task" — nenhuma task é fechada sem entrada correspondente no PROGRESS.md.
