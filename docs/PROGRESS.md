# PROGRESS.md

Registro vivo do que já foi feito e das decisões técnicas tomadas.

> **Processo:** ao fechar cada task (ver _Definition of Done_ em [TASKS.md](TASKS.md)), adicione aqui uma linha na tabela de tasks e, quando houver uma escolha relevante, uma entrada em _Decisões Técnicas_.

---

## Tasks Concluídas

| Task | Descrição | Decisões relevantes |
| ---- | --------- | ------------------- |
| T001 | Inicializar projeto Node.js + TypeScript | yarn como gerenciador; scripts build/start/dev |
| T002 | Estrutura de diretórios das camadas | barrels `index.ts` por camada |
| T003 | Tipos base do domínio | fiel ao ARCHITECTURE; `Equipment`/`StatModifier` adiados |
| T004 | Configuração e constantes globais | `core/config.ts` centralizado |
| T005 | Utilitários random/dice/math | `rng` injetável para testes determinísticos |
| T006 | GameState e estado inicial | factory desacoplada das classes |
| T007 | GameEngine | máquina de fases, sem I/O |
| T008 | Classes jogáveis (Warrior/Archer/Mage) | skills com efeito neutro (ver D-01) |
| T009 | Criação de personagem | `getPlayerAttack` = maior atributo |
| T010 | Sistema de experiência e level up | curva `100 * level^1.5` |
| T011 | CombatEngine (esqueleto) | opera sobre cópias dos combatentes |
| T012 | Ataque básico e fórmula de dano | `attack - defense/2`, mínimo 1 |
| T013 | Sistema de turnos | jogador começa; inimigo sem `speed` |
| T014 | Habilidades com cooldown e mana | cooldown por rodada |
| T015 | Vitória e derrota | recompensa de XP; gold/loot na Fase 5 |
| T016 | Monstros básicos | Goblin/Lobo do CONTENT_BIBLE; Esqueleto/Orc (ver D-04) |
| T017 | Região inicial (Campos Iniciais) | id `campos_iniciais` = START_REGION |
| T018 | Chefe inicial (Rei Goblin) | chefe como `Enemy` reforçado |
| T019 | Estrutura de itens | guards `isEquipment`/`isConsumable` |
| T020 | InventorySystem | funções puras (sem mutação) |
| T021 | Equipamentos (slots) | `Loadout` separado do `Player` (ver D-03) |
| T022 | Loot tables | sorteio por peso (`weightedPick`) |
| T023 | WorldEngine | retorna ids, não objetos (ver D-02) |
| T024 | Eventos aleatórios | contrato `GameEvent` na core |
| T025 | Progressão entre regiões | só Campos Iniciais no MVP |
| T026 | Menu principal | prompter injetável |
| T027 | HUD | renderizadores puros (tempo real) |
| T028 | ANSI art | logo via figlet |
| T029 | SaveSystem | `SaveStorage` injetável |
| T030 | LoadSystem | validação + round-trip |
| T031 | Balanceamento inicial | simulação `autoBattle` |
| T032 | Polimento (integração) | `applyVictoryRewards` |
| T033 | Release MVP (jogável) | `runGame` + porta `GameIO`; bug de turno corrigido |
| T034 | Sistema de i18n (Translation) | motor em `utils/i18n.ts`; estado de idioma de módulo; `t()` com fallback |
| T035 | Identificadores em inglês | renomeados consts/ids/arquivos pt-BR→en; `reiGoblin.ts`→`goblinKing.ts`, `camposIniciais.ts`→`startingFields.ts`; nomes exibidos serão localizados em T037 |
| T036 | Erros e exceções via i18n | todos os `throw` usam `t()`; catálogos movidos para arquivos isolados em `utils/locales/` (a pedido do usuário); erros seguem o idioma atual |
| T037 | Seleção de idioma pelo usuário | opção "Idioma" no menu; UI/mensagens via `t()`; `GameState.language` persistido e restaurado no load |
| T037+ | Localização total de conteúdo | nomes/descrições de classes, inimigos, chefe, itens, skills, regiões e mensagens de skills/eventos agora são chaves i18n resolvidas via `t()` (pt-BR/en); HUD e menu legado também localizados. Conteúdo sem texto humano hardcoded. ASCII art (T028) permanece com rótulos embutidos e não é exibida no fluxo atual |
| T038 | Padronização e isolamento dos testes | todas as descrições `describe`/`it` em inglês; cada teste movido para `__tests__/` no seu path; imports relativos ajustados |
| T050 | Overhaul de UI (TUI) | `GameRenderer` (tela cheia, clear+redraw, log limitado); telas dedicadas (menu/criação/exploração/combate/vitória/game over); ANSI art de inimigos+chefe+classes+regiões; barras coloridas. Lógica de jogo intacta (ver D-05) |
| T051 | Unificar inventário (conclui T040) | `GameState.inventory` é o inventário canônico; campo `Player.inventory` removido (era duplicado e nunca atualizado — causava drops não aparecerem no HUD). `ExploreContext`/`ExploreScreenView` passam `itemCount` derivado de `state.inventory.items.length` |
| T052 | Itens empilháveis | `Inventory.items` agora é `InventorySlot[]` (`{ item, quantity }`). Consumíveis empilham por id; equipamento não empilha (pilha individual). `addItem`/`removeItem` operam por unidade; novo `totalItems`. Save migra formato antigo (`Item[]`) reagrupando via `addItem` (ver D-06) |
| T055 | Equipar (fundação) | `loadout` adicionado ao `GameState` e persistido no save (default `{}` em saves antigos). Novo `applyLoadoutToPlayer` aplica os bônus sobre uma cópia do jogador usada no combate; após o combate só hp/mana voltam ao jogador-base (atributos-base nunca recebem o bônus — ver D-07). Executada antes da T053; a interação de equipar virá com a tela |
| T053 | Tela de inventário (estilo Tibia) | `inventoryScreen` paper-doll: slots de equipamento ao redor do corpo (mini-painéis, nome truncado p/ grade uniforme) + mochila com quantidades + ouro. Ação "Inventário" no menu de exploração; `GameIO.inventory` + loop `manageInventory` que equipa/desequipa via `equipFromInventory`/`unequipToInventory` (item ⇄ mochila) e salva ao fechar |
| T054 | Usar consumíveis | `useConsumable` (puro, clampa HP/Mana). Fora do combate: ação "Usar" na tela de inventário (mostra HP/Mana). Em combate: ação "item" no menu (`CombatEngine.useItem`), que consome o turno; o inventário é descontado durante o combate e sincronizado ao fim (inclusive em fuga) |
| T056 | Loja / Comerciante | `systems/shop.ts` puro (`buyOffer` com gate de nível + saldo, `sellItem` a `SELL_RATE` 50%). `content/shops` data-driven: loja fixa (poções + Armadura de Couro/Espada de Ferro) e estoque exclusivo do mercador (Amuleto do Vigor, Anel do Poder). `shopScreen` lista ofertas (bloqueadas em cinza) e itens à venda. Ação "Loja" no menu + evento `merchant` no encontro aleatório; `EventResult` (goldChange/itemId/openShop) agora é aplicado de fato — o baú finalmente concede ouro/item (ver D-08). 4 novos equipamentos adicionados. Menu da loja em dois níveis (Comprar/Vender separados); ofertas sem nível/ouro ficam esmaecidas no `grayList` em vez de virar mensagem repetida. Compra e venda **múltiplas**: após escolher o item, o jogador digita a quantidade (compra limitada ao ouro; venda à pilha; `buyOffer`/`sellItem` aceitam quantidade) |
| T057 | Design de progressão | Documento [PROGRESSAO.md](PROGRESSAO.md): diagnóstico (inimigos Lv1–4 + chefe Lv5 num jogo até Lv50), abordagens (escalonamento/faixas/híbrido — recomendado o híbrido), esboço técnico (`scaleEnemy`) e tasks de backlog. Apenas design; implementação aguarda aprovação |
| T060 | Tipos do mundo de descoberta | Novos tipos para o "Mapa-Constelação" (FASE 16): `Location` (POI com `coord {col,row}`, `connections[]`, `requirements?`, `content` em união discriminada), `LocationState`/`LocationType`/`LocationContent`/`DiscoveryRequirement`/`MapCoord`, `NPC`, `Dialogue`/`DialogueNode`/`DialogueOption`/`DialogueEffect`, `Knowledge`. `Region` ganhou campos **opcionais** (`entryLocationId`, `locations`, `knowledge`) e `Quest` ganhou `regionId?`/`objectives?` — conteúdo linear existente (`startingFields`) compila intacto. Decisão: grafo é aditivo, regiões sem `locations` seguem lineares (fallback). Sem implementação nesta task (só contratos) |
| T061 | GameState + save/migração | `GameState` ganhou `currentLocationId?`, `locationStates` (`Record<id, LocationState>`), `knowledge: string[]` e `npcStates` (`Record<id, NpcState>` com `talkedTo`). `createInitialGameState` inicializa via `createInitialLocationStates` (local de entrada = `discovered`; demais ocultos — revelar vizinhos fica para o sistema de descoberta). `deserializeGameState` aplica **defaults** para saves antigos (sem os campos → `{}`/`[]`, `currentLocationId` cai no `entryLocationId` da região). Round-trip preservado (ambos os lados vêm de `createInitialGameState`). Teste novo cobre o default de save legado |
| T062 | systems/discovery.ts (puro) | Lógica de descoberta imutável. **Modelo de estados:** persistido = `undiscovered`/`discovered`/`completed`; exibição = deriva `available`/`locked` por `meetsRequirement` a cada leitura (sem estado obsoleto quando o conhecimento muda). `getLocationState`, `reveal` (idempotente, não rebaixa concluído), `revealConnections` (descoberta em cadeia — só vizinhos diretos), `markCompleted`, `getDestinations` (vizinhos revelados + estado; inclui `locked` para a UI esmaecer) e `canTravelTo`. Gates: nível, item (`hasItem`) e conhecimento. 10 testes cobrindo gates, transições, cadeia e destinos |
| T063 | systems/journal.ts (puro) | Conhecimento como progressão. `addKnowledge` (imutável, sem duplicar), `hasKnowledge`/`hasAllKnowledge` (usados nos gates da T062), `findKnowledge`, `getKnownFacts` (só ☑ — não expõe fatos não descobertos, preservando o mistério; os ☐ pendentes virão dos objetivos de missão na T069) e `knowledgeProgress`. 6 testes |
| T064 | systems/dialogue.ts (puro) | Percorre a árvore de diálogo sem conhecer o `GameState`. `getStartNode`/`getNode`, `availableOptions` (filtra por `requires` reusando `meetsRequirement` da T062), `chooseOption` → `DialogueStep` (`effects` + `nextNode`; encerra quando não há `goto`). Os efeitos (`revealLocation`/`grantKnowledge`/`startQuest`/`openShop`/`startCombat`) são devolvidos para o orquestrador aplicar. Erro de `start` ausente via `t()`. 7 testes |
| T065 | core/WorldMapEngine | Orquestração de navegação (core compõe os sistemas puros, sem I/O — dependência core→systems é a prevista no ARCHITECTURE; imports diretos dos arquivos evitam ciclo via barrel). `travelTo` valida destino (revelado+disponível via `canTravelTo`), move o local atual e revela vizinhos (cadeia); devolve o `content` para o loop resolver. `applyDialogueEffect` aplica efeitos puros (conhecimento/revelar) e devolve ações de IO (loja/combate/missão). `isCompletable` (combat/boss/lore fecham o local; npc/shop não). `discoveryContextFromState` monta os gates a partir do estado/inventário. **Ajuste:** `createInitialLocationStates` passou a revelar a entrada **e seus vizinhos diretos** (início precisa de destino). 10 testes |
| T066 | Conteúdo: Região 1 como grafo | **Bosque Sombrio** (`dark_woods`) como grafo de 8 POIs: Vila (entrada, hub) → Estrada (goblin) / Caçador (NPC) / Mercador (loja); Estrada → Bosque (lobo) → Ruínas (lore: concede `crypt_entrance`) → Cripta 🔒 (esqueleto, requer `crypt_entrance`) → Necromante 👑 (boss). Novo chefe `forest_necromancer` (+loot). NPC Caçador + diálogo em árvore (concede `goblins_raid`/`necromancer_seen`/`ancient_crypt`, inicia a investigação, revela o bosque). Missão de investigação `investigate_dark_woods` (objetivos por conhecimento/local, não "mate N"). 4 conhecimentos. Novos registries data-driven: `content/{knowledge,npcs,dialogues,quests}` com finders (`findKnowledgeById`/`findNpcById`/`findDialogueById`/`findQuestById`). `startingFields` mantida (compat/testes); `REGION_ORDER` = [dark_woods, starting_fields]. Teste de integridade do grafo (entrada, conexões, conteúdo, gates, alcance do chefe via BFS, efeitos de diálogo e objetivos) — 11 asserts |
| T067 | UI: mapa da região | `ui/ansi/mapRender.ts`: `renderRegionMap` desenha o grafo como **árvore de descoberta** a partir da entrada (├──/└──) — um nó por linha (robusto com emojis de largura variável). Mostra só o descoberto; vizinhos ocultos viram `❓` (mistério), revelados coloridos por estado (cyan=disponível, verde+✓=concluído, cinza+🔒=bloqueado) e o atual marcado `◄ você está aqui`. `renderMapLegend` (4 estados). `ui/screens/mapScreen.ts`: compõe mapa+legenda+resumo do local atual num painel. A UI não calcula estados — recebe `displayStates` do loop. 6 testes (ícones, fog, locked/completed, sem-grafo, legenda) |
| T068 | UI: diálogo de NPC | `ui/screens/dialogueScreen.ts`: `renderDialogueScreen` mostra o interlocutor (ícone+nome), a fala atual (itálico) e as opções numeradas (já filtradas pelos gates). Só renderização — a escolha é feita pela IO e as revelações são exibidas pelo loop após a escolha. 1 teste |
| T069 | UI: diário | `ui/screens/journalScreen.ts`: conhecimentos adquiridos (☑) + progresso (`n/total`) e os objetivos da investigação (☑ concluído / ☐ pendente). Usa seletores puros do `journal` (`getKnownFacts`, `knowledgeProgress` e novo `isObjectiveComplete` — objetivo fecha quando o conhecimento é adquirido e/ou o local é concluído). UI sem regra de negócio. 3 testes (+helper testado no fluxo) |

---

## Decisões Técnicas

### Ferramentas e processo

- **yarn** é o gerenciador de pacotes (yarn.lock versionado), não npm.
- **Biome** para formatação/lint, **Husky** + **commitlint** validando `tipo(T###): descrição`.
- Commitlint aceita escopo `T###` ou escopos de infra (`tooling`, `docs`, `ci`, `release`, `deps`, `repo`) — revisão pendente em **T042**.
- **Vitest** para testes; toda lógica importante é testada sem interface.
- Libs de UI em versões **CJS-compatíveis** (chalk 4, boxen 5, inquirer 8), pois o projeto é CommonJS.

### Arquitetura

- **D-02 — Core desacoplada de conteúdo:** engines da `core` (WorldEngine, rewards) retornam/recebem **ids ou dados já resolvidos**, nunca importam a camada `content`. O chamador resolve ids → objetos.
- **D-03 — Loadout separado do Player:** o conjunto de equipamentos vestidos é um `Loadout` próprio (systems), não um campo do `Player`, para não alterar o contrato do ARCHITECTURE.
- **D-06 — Inventário por pilhas:** `Inventory.items` passou de `Item[]` para `InventorySlot[]` (`{ item, quantity }`). Empilham apenas itens não-equipamento (`!isEquipment`), refletindo o comportamento do Tibia (poções empilham, equipamento não). Saves antigos (lista crua de itens) são migrados na desserialização reagrupando via `addItem`, sem quebrar compatibilidade.
- **D-07 — Bônus de equipamento sem corromper a base:** o `Loadout` vive em `GameState` (não no `Player`, mantendo D-03). O combate roda sobre um jogador "efetivo" (`applyLoadoutToPlayer` = base + bônus); ao fim, só `hp`/`mana` são sincronizados de volta (limitados aos máximos-base). Assim os atributos-base persistidos nunca acumulam bônus e o equipamento é recalculado a cada combate.
- **D-08 — Efeitos de evento aplicados no orquestrador:** o handler de eventos do loop de exploração passou a aplicar o `EventResult` (`goldChange`, `itemId`, `openShop`) ao estado — antes só a mensagem era exibida e o baú não concedia nada. `openShop` abre a loja do mercador com estoque exclusivo. Gate de nível e desvalorização na venda vivem em `systems/shop.ts` (puro); o conteúdo das lojas é data-driven em `content/shops`.
- **D-09 — Balanceamento da economia:** o ouro de combate deixou de ser fixo (5–100, que inflacionava) e passou a ser uma fração da recompensa de XP do inimigo (`GOLD_REWARD_MIN/MAX_FACTOR` em config = 0.5–1.0), atrelando ganho à dificuldade. Os **preços de compra** da loja foram desacoplados do `value` (que segue governando a venda a 50%) e elevados em `content/shops`, tornando equipamento um investimento real. Ajustável por esses dois pontos.
- Engines não fazem I/O; a UI consome as engines. O loop jogável usa a porta **`GameIO`** (injetável), o que torna o playthrough testável.
- `rng` injetável em todas as funções aleatórias para testes determinísticos.

### UI / Renderização

- **D-05 — Overhaul de UI sem mexer na lógica:** o spec pedia uma TUI de
  tela cheia. Mantive `CombatEngine`/progressão/XP/loot/classes/save
  intactos e toquei só na camada `ui` e na cola de I/O. Para alimentar as
  telas ricas sem quebrar a porta testável, enriqueci os **parâmetros** de
  `GameIO` (`exploreAction(context)`, `combatAction(context, skills)`) —
  compatível por estrutura com os fakes dos testes, que ignoram args — e
  adicionei hooks **opcionais** `victory?`/`gameOver?`. Todos os
  `io.render(t(...))` foram preservados, então as asserções de texto dos
  testes continuam válidas.
- **Renderer stateful:** `GameRenderer` guarda a cena atual + um buffer de
  log (limite 6) e, a cada `paint()`, limpa a tela (`ESC[2J/3J/H`) e
  redesenha cena + painel de log numa única escrita. O `maxHp` do inimigo
  em combate vem do template original (a engine opera sobre cópias).
- **boxen v5:** sem opção `width` e com `Options` `readonly`; a largura
  fixa dos painéis é obtida preenchendo o conteúdo (`panel({ width })`),
  não pela lib.

### Correções

- **Habilidade em cooldown encerrava o jogo:** o menu de combate listava skills em cooldown como selecionáveis; ao escolher uma, o `throw` de `CombatEngine.useSkill` subia até o handler global e fechava o jogo. Agora `combatAction` recebe `CombatSkillOption[]` (skill + cooldown atual) e a UI **desabilita** a habilidade mostrando `volta em N turno(s)` (chave i18n `combat.cooldown`, pt-BR/en). Defesa em profundidade: mensagens de erro de cooldown/mana passaram a traduzir o nome via `t(skill.name)` em vez de exibir a chave crua.

### Pendências assumidas (viram backlog na Fase 11)

- **D-01 — Efeito numérico das habilidades:** `Skill.execute()` retorna efeito neutro (`damage/healing = 0`) porque o contrato `execute(caster: Entity, target: Entity)` não dá acesso aos atributos. Resolver exige mudança no contrato → **T039**.
- **Player.inventory × GameState.inventory:** redundância prevista no ARCHITECTURE; `GameState.inventory` é tratado como canônico → **T040**.
- **D-04 — Roster da Região 1:** usei Goblin/Lobo/Esqueleto/Orc (TASKS T016) em vez do roster exato do CONTENT_BIBLE (Rato Gigante, Bandido) → **T041**.
