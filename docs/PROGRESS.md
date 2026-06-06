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
