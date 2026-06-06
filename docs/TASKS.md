# TASKS.md

# Terminal Realms Development Roadmap

Este documento define a ordem oficial de implementação.

O Claude deve executar as tarefas sequencialmente.

Não iniciar uma tarefa antes da anterior estar concluída e funcional.

---

# FASE 1 — FOUNDATION

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

# FASE 2 — CORE GAME

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

# FASE 3 — COMBATE

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

# FASE 4 — CONTEÚDO INICIAL

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

# FASE 5 — LOOT E EQUIPAMENTOS

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

# FASE 6 — EXPLORAÇÃO

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

# FASE 7 — INTERFACE

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

# FASE 8 — PERSISTÊNCIA

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

# FASE 9 — MVP RELEASE

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

# FASE 10 — ROADMAP FUTURO

Não implementar nesta etapa.

---

## T034

Crafting

---

## T035

Missões secundárias

---

## T036

Mercadores avançados

---

## T037

Sistema de reputação

---

## T038

Novas regiões

- Floresta Sombria
- Montanhas Congeladas
- Pântano Maldito
- Terras Infernais

---

## T039

Novos chefes

---

## T040

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
