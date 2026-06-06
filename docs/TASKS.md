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
| 10 — Internacionalização (i18n) | T034–T038 | ⏳ A fazer |
| 11 — Refinamentos Técnicos | T039–T042 | 🗄️ Backlog |
| 12 — Roadmap Futuro | T043–T049 | 🗄️ Backlog |

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

# FASE 10 — INTERNACIONALIZAÇÃO (i18n) — ⏳ A FAZER

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

## T040

Unificar `Player.inventory` e `GameState.inventory`.

Remover a redundância prevista no ARCHITECTURE, definindo um inventário canônico.

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
