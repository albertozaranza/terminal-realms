# ARCHITECTURE.md

# Terminal Realms Architecture

Este documento define a arquitetura oficial do projeto.

Todas as implementações devem respeitar estas definições.

---

# Objetivos Arquiteturais

A arquitetura deve permitir:

- Adicionar novas classes sem alterar a engine
- Adicionar novos monstros sem alterar combate
- Adicionar novos itens sem alterar sistemas
- Adicionar novas regiões sem alterar exploração
- Testar regras de negócio isoladamente
- Trocar a interface terminal sem impactar a lógica

---

# Arquitetura Geral

```text
┌─────────────────┐
│       UI        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Game Engine   │
└────────┬────────┘
         │
 ┌───────┼────────┐
 ▼       ▼        ▼
Combat  World   Systems
         │
         ▼
      Content
```

---

# Camadas

## UI Layer

Responsável apenas por exibição.

Não contém regras de negócio.

Exemplos:

- Menus
- ANSI Art
- Tabelas
- Barras de vida
- Inputs

Diretório:

```text
src/ui
```

---

## Engine Layer

Responsável por orquestrar o jogo.

Exemplos:

- Turnos
- Fluxo principal
- Estados globais

Diretório:

```text
src/core
```

---

## Systems Layer

Sistemas reutilizáveis.

Exemplos:

- Inventário
- Loot
- Save
- Equipamentos
- Quests

Diretório:

```text
src/systems
```

---

## Content Layer

Dados do jogo.

Nenhuma lógica.

Diretório:

```text
src/content
```

---

# Estrutura de Pastas

```text
src/

core/
├── GameEngine.ts
├── GameState.ts
├── CombatEngine.ts
├── WorldEngine.ts

classes/
├── Warrior.ts
├── Archer.ts
├── Mage.ts

systems/
├── InventorySystem.ts
├── EquipmentSystem.ts
├── LootSystem.ts
├── QuestSystem.ts
├── SaveSystem.ts

content/
├── enemies/
├── bosses/
├── items/
├── skills/
├── regions/

ui/
├── screens/
├── menus/
├── components/
├── ansi/

types/
├── Player.ts
├── Enemy.ts
├── Item.ts
├── Skill.ts

utils/
├── random.ts
├── dice.ts
├── math.ts
```

---

# Fluxo Principal

```text
Start
  │
  ▼
Main Menu
  │
  ▼
Load/Create Character
  │
  ▼
Game Loop
  │
  ├─ Explore
  │
  ├─ Event
  │
  ├─ Combat
  │
  ├─ Loot
  │
  └─ Save
  │
  ▼
Boss
  │
  ▼
Next Region
```

---

# Estado Global

A aplicação possui um único estado principal.

```typescript
interface GameState {
  player: Player;
  currentRegion: Region;
  inventory: Inventory;
  activeQuest?: Quest;
  statistics: Statistics;
}
```

A UI nunca altera diretamente o estado.

Todas as mudanças devem passar pela engine.

---

# Sistema de Entidades

Todas as entidades compartilham uma estrutura básica.

```typescript
interface Entity {
  id: string;
  name: string;
}
```

---

# Jogador

```typescript
interface Player extends Entity {
  level: number;
  experience: number;

  hp: number;
  maxHp: number;

  mana: number;
  maxMana: number;

  strength: number;
  dexterity: number;
  intelligence: number;

  defense: number;
  speed: number;

  classId: string;

  inventory: Item[];
}
```

---

# Inimigos

```typescript
interface Enemy extends Entity {
  level: number;

  hp: number;

  attack: number;

  defense: number;

  experienceReward: number;

  lootTableId: string;
}
```

---

# Equipamentos

```typescript
interface Equipment extends Item {
  slot: EquipmentSlot;

  modifiers: StatModifier[];
}
```

---

# Habilidades

```typescript
interface Skill {
  id: string;
  name: string;
  description: string;

  manaCost: number;

  cooldown: number;

  execute(caster: Entity, target: Entity): SkillResult;
}
```

---

# Sistema de Combate

## Responsabilidades

CombatEngine:

- iniciar combate
- processar turnos
- calcular dano
- validar habilidades
- determinar vencedor

---

# Fluxo de Combate

```text
Combat Start
      │
      ▼
Player Turn
      │
      ▼
Choose Action
      │
      ▼
Resolve Action
      │
      ▼
Enemy Turn
      │
      ▼
Resolve Enemy Action
      │
      ▼
Victory?
      │
 ┌────┴────┐
 │         │
Yes        No
 │         │
 ▼         │
Rewards ◄──┘
```

---

# Fórmula de Dano

Versão inicial:

```typescript
damage = attack - defense / 2;
```

Mínimo:

```typescript
1;
```

Adicionar crítico posteriormente.

---

# Sistema de Eventos

Eventos são desacoplados.

```typescript
interface GameEvent {
  id: string;
  title: string;

  execute(gameState: GameState): EventResult;
}
```

---

# Sistema de Loot

Loot baseado em peso.

Exemplo:

```typescript
[
  {
    itemId: "wood_sword",
    weight: 50,
  },
  {
    itemId: "iron_sword",
    weight: 30,
  },
  {
    itemId: "epic_sword",
    weight: 5,
  },
];
```

Nunca utilizar sorteio por cadeias extensas de if/else.

---

# Sistema de Regiões

```typescript
interface Region {
  id: string;

  name: string;

  minLevel: number;

  maxLevel: number;

  enemyPool: string[];

  bossId: string;

  // FASE 16 — exploração por grafo de descoberta (campos opcionais)
  entryLocationId?: string;
  locations?: Location[];
  knowledge?: Knowledge[];
}
```

## Exploração: linear vs. grafo de descoberta (FASE 16)

Uma região pode ser explorada de duas formas, decididas pelos dados:

- **Linear (legado):** apenas `enemyPool`/`bossId`. Encontros aleatórios e
  chefe fixo (`exploreLinear` em `game.ts`).
- **Grafo de descoberta:** quando `locations` e `entryLocationId` estão
  presentes, a região vira uma rede de **POIs** (`Location`) que o jogador
  descobre progressivamente. Não há grid/WASD: viaja-se selecionando locais
  conhecidos (`exploreGraph`).

Camadas envolvidas (todas data-driven e testáveis sem interface):

- **types:** `Location`, `LocationState`, `LocationContent`, `NPC`,
  `Dialogue`, `Knowledge`.
- **systems (puro):** `discovery` (revelar/estados/destinos/gates),
  `journal` (conhecimento/objetivos), `dialogue` (árvore + efeitos).
- **core:** `WorldMapEngine` orquestra `travelTo` e os efeitos de diálogo
  (core compõe systems; nunca o contrário).
- **content:** grafo de locais, NPCs, diálogos, conhecimentos e missões de
  investigação (ex.: `content/regions/darkWoods.ts`).
- **ui:** `mapScreen`/`mapRender`, `dialogueScreen`, `journalScreen`,
  `worldMapScreen` — recebem estados já derivados, sem regra de negócio.

O **conhecimento** é a moeda de progressão: destrava locais (`requirements`),
opções de diálogo e chefes. O estado de descoberta vive em `GameState`
(`locationStates`, `knowledge`, `npcStates`, `currentLocationId`) e é
persistido com migração para saves antigos.

---

# Sistema de Classes

Todas as classes implementam o mesmo contrato.

```typescript
interface CharacterClass {
  id: string;

  name: string;

  getStartingStats(): Stats;

  getStartingSkills(): Skill[];
}
```

A engine nunca deve conhecer Guerreiro, Arqueiro ou Mago diretamente.

A engine trabalha apenas com CharacterClass.

---

# Sistema de Persistência

Responsável apenas por salvar e carregar.

```typescript
interface SaveSystem {
  save(gameState: GameState): Promise<void>;

  load(): Promise<GameState>;
}
```

---

# Dependências Permitidas

```text
chalk
figlet
boxen
cli-table3
inquirer
commander
lowdb
```

Qualquer nova dependência deve ser justificada.

---

# Dependências Proibidas

Não utilizar:

- Frameworks web
- ORMs
- Bancos de dados externos
- Electron
- NestJS
- React
- Vue

O jogo deve permanecer um CLI puro.

---

# Regras de Evolução

Ao adicionar novos conteúdos:

- Não alterar a engine
- Não alterar sistemas existentes
- Utilizar apenas arquivos de conteúdo

Exemplo:

Adicionar um novo dragão deve exigir apenas:

```text
content/enemies/dragon.ts
```

Nada mais.

---

# Métrica de Qualidade

Antes de concluir qualquer feature, verificar:

- Compila sem erros
- Não quebra saves existentes
- Não duplica código
- Possui tipos explícitos
- Mantém separação entre UI e lógica
- Mantém compatibilidade com conteúdos existentes

Se qualquer item falhar, a implementação deve ser revisada.
