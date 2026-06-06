# Plano de Desenvolvimento — FASE 16: Mundo por Descoberta

> Status: **proposta para análise** (não iniciar implementação antes da aprovação).
> Base: [docs/spec.md](spec.md) (`PROMPT_DYNAMIC_WORLD_AND_DISCOVERY`).
> Referências obrigatórias: [CLAUDE.md](../CLAUDE.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GDD.md](GDD.md), [CONTENT_BIBLE.md](CONTENT_BIBLE.md).

## Decisões travadas

1. **Navegação:** grafo de descoberta. Visual rico de mapa (caixas, conexões, fog, portas 🔒) com viagem por seleção de locais conhecidos no menu. **Sem andar tile-a-tile** — respeita a spec.
2. **Layout do mapa:** coordenadas manuais no dado (`coord {col,row}`); renderer desenha caixas e conexões ortogonais. Sem engine de tiles.
3. **Escopo da 1ª entrega:** fatia vertical completa na **Região 1 (Bosque Sombrio)** — jogável fim-a-fim antes de expandir.

## Mudança arquitetural a aprovar

Hoje a progressão é **linear**: [WorldEngine.advance()](../src/core/WorldEngine.ts) sorteia encontro e [systems/region.ts](../src/systems/region.ts) avança por `REGION_ORDER`. Esta fase substitui isso por **navegação em grafo de locais**. É aditivo — combate, loot, XP, classes, save e i18n **não mudam de regra**, apenas ganham um novo orquestrador de mundo. Conforme a regra do TASKS.md, esta é a proposta formal da mudança.

---

## Modelo conceitual — "Mapa-Constelação"

O mundo é um **grafo de POIs**. Cada local tem coordenadas e conexões. O jogador **viaja** para um local *alcançável já descoberto* (menu) — não anda pelo mapa. Visitar um local revela vizinhos (`?` → ícone); conversar com NPCs / concluir missões revela atalhos e destrava portas (🔒). Não-linear: múltiplas rotas, becos, locais opcionais, gates por conhecimento.

```
Mundo
 └── Regiões (grafo de regiões)
      └── Locais / POIs (grafo de locais)
           └── Conteúdo: combate | npc | evento | loja | boss | lore
```

### Estados do local (spec)
`UNDISCOVERED ❓` · `DISCOVERED 🌲` · `AVAILABLE ⚔` · `COMPLETED ✅` · `LOCKED 🔒`

### Mockup — mapa da região
```
╔══════════════════════ 🌲 BOSQUE SOMBRIO ══════════════════════╗
║ 🏰 vila  🧙 npc  💰 loja  🏚 ruína  🪦 cripta  👑 chefe        ║
║ ⚔ disponível   ✅ concluído   🔒 bloqueado   ❓ desconhecido   ║
╠════════════════════════════════════════════════════════════════╣
║   [🏰 Vila Oakheart]━━━━━━━[✅ Estrada Principal]              ║
║         ┃                          ┃                          ║
║   [🧙 Caçador]              [🌲 Bosque Sombrio] ◄ você         ║
║                              ┏━━━━━┻━━━━━┓                     ║
║                         [🏚 Ruínas]   [❓ ? ? ?]              ║
║                              ┃                                 ║
║                         [🔒 Cripta Esquecida]                 ║
║                            requer: "entrada atrás da cachoeira"║
║                              ┊                                 ║
║                         [👑 ? ? ?]                            ║
╚════════════════════════════════════════════════════════════════╝
```

### Mockup — diário de conhecimento
```
📖 Conhecimentos — Bosque Sombrio
  ☑ Goblins atacam viajantes na estrada.
  ☑ Um necromante foi visto na floresta.
  ☑ Existe uma cripta antiga.
  ☐ Localização da cripta.        → destrava 🔒 Cripta
  ☐ Fraqueza do necromante.       → bônus no chefe
```

---

## Modelo de dados (novos tipos — `src/types/`)

```
Location (POI)   id, name, icon, type, regionId, coord {col,row},
                 connections: string[],            // arestas do grafo
                 requirements?: { knowledge?, level?, itemId? },
                 content: LocationContent           // o que ocorre ao visitar
LocationContent  combat | npc | event | shop | boss | lore (união discriminada)
LocationState    UNDISCOVERED | DISCOVERED | AVAILABLE | COMPLETED | LOCKED
NPC              id, name, personality, dialogueId, knowledgeGranted[]
Dialogue         árvore de nós → opções com effects:
                 revealLocation | grantKnowledge | startQuest | openShop | startCombat
Knowledge        id, text, regionId, unlocks
JournalEntry     knowledgeId, known: boolean
Region (estende) entryLocationId, locations: Location[]
Quest (estende)  tipo investigação (objetivos por conhecimento, não só "mate N")
```

`GameState` ganha: `currentLocationId`, `locationStates: Record<id, LocationState>`, `knowledge: string[]`, `journal`, `npcStates`. **Save**: migração com defaults (saves antigos entram na `entryLocation` com fog total) — mesmo padrão da migração de inventário em [save.ts](../src/systems/save.ts).

---

## Tasks — FASE 16

Ordem: tipos → lógica pura → conteúdo → UI → integração → polimento. Um commit e uma entrada no PROGRESS.md por task (DoD do projeto).

| Task | Escopo | Depende |
|------|--------|---------|
| **T060** | Tipos do mundo de descoberta (Location, NPC, Dialogue, Knowledge, LocationState; Region/Quest estendidos) | — |
| **T061** | GameState + save/migração (locationStates, knowledge, journal, npcStates, currentLocation) | T060 |
| **T062** | `systems/discovery.ts` puro: revelar local, marcar concluído, `getReachableDestinations`, checagem de requisitos, descoberta em cadeia | T060/61 |
| **T063** | `systems/journal.ts` puro: addKnowledge, hasKnowledge, gates de conhecimento | T060/61 |
| **T064** | `systems/dialogue.ts` puro: percorrer árvore, aplicar `effects` (retorna efeitos para a engine aplicar) | T060/61 |
| **T065** | `core/WorldMapEngine`: `travelTo(locationId)` resolve conteúdo do local → encontro + dispara revelações. Refatora o `advance()` linear | T062/63/64 |
| **T066** | Conteúdo: Região 1 como grafo (Vila Oakheart, Estrada, Caçador, Bosque, Ruínas, Cripta 🔒, Necromante 👑, mercador) — NPCs, diálogos, conhecimentos, missões de investigação | T060–065 |
| **T067** | UI: `ui/ansi/mapRender.ts` + `ui/screens/mapScreen.ts` — mapa espacial com fog, ícones por estado, 🔒 com requisito, "você está aqui", legenda | T065 |
| **T068** | UI: `ui/screens/dialogueScreen.ts` — fala do NPC + opções numeradas + feedback de revelação | T064 |
| **T069** | UI: `ui/screens/journalScreen.ts` — ☑/☐ por região | T063 |
| **T070** | UI: mapa-múndi de regiões (absorve **T059**) — regiões conhecidas, ramificado | T067 |
| **T071** | Integração no loop ([src/game.ts](../src/game.ts)): menu de exploração → Mapa / Viajar / Diário / Inventário / Loja / Salvar; fia travel → conteúdo → combate/diálogo/evento/boss; i18n en/ptBR | todas |
| **T072** | Polimento: arte ANSI por tipo de local, balanceamento, `yarn check`/`tsc`/`test:run`/`build` verdes; atualizar ARCHITECTURE/GDD/CONTENT_BIBLE/spec | todas |

## Tasks absorvidas / relacionadas

- **T059** (mapa de regiões) → entra em **T070**.
- **T044** (missões secundárias) → formato de quest de investigação nasce em **T066**.
- **T047/T048** (novas regiões/chefes) → reaproveitam o grafo após a fatia vertical.
- **T057/T058** (progressão e loja por região) → independentes, combinam bem.

## Riscos / decisões em aberto

- Auto-layout descartado: coordenadas manuais evitam mapas sobrepostos e overengineering.
- Atualizar docs que hoje descrevem progressão linear (ARCHITECTURE/GDD/CONTENT_BIBLE/spec) — incluído na T072.
