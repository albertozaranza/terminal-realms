# CLAUDE.md

# Terminal Realms

Este documento define as regras, arquitetura, padrões e objetivos do projeto.

Todas as implementações devem seguir estas diretrizes.

---

# Visão do Produto

Terminal Realms é um RPG medieval de terminal inspirado em D&D 5e.

O jogo é executado inteiramente via terminal utilizando ANSI Art, menus interativos e renderização textual.

O foco principal é:

- Progressão de personagem
- Exploração
- Combate por turnos
- Loot
- Equipamentos
- Chefes
- Rejogabilidade

O jogo deve ser divertido mesmo sem interface gráfica.

---

# Filosofia de Desenvolvimento

Priorizar:

1. Jogabilidade
2. Clareza do código
3. Modularidade
4. Extensibilidade
5. Performance

Evitar:

- Overengineering
- Dependências desnecessárias
- Acoplamento forte
- Classes gigantes
- Arquivos com mais de 500 linhas

---

# Stack Tecnológica

Linguagem:

- TypeScript

Runtime:

- Node.js

Bibliotecas permitidas:

- chalk
- boxen
- figlet
- cli-table3
- commander
- inquirer
- lowdb

Não adicionar dependências sem necessidade real.

---

# Estrutura de Diretórios

```text
src/
├── core/
├── classes/
├── systems/
├── content/
├── ui/
├── types/
├── utils/
└── index.ts
```

Responsabilidades:

## core

Contém regras fundamentais do jogo.

Exemplos:

- combate
- entidades
- progressão
- mundo

Nunca colocar código de interface aqui.

---

## classes

Implementações das classes jogáveis.

Exemplos:

- warrior
- archer
- mage

Cada classe deve ser independente.

---

## systems

Sistemas reutilizáveis.

Exemplos:

- inventory
- quests
- loot
- save
- equipment

---

## content

Todo conteúdo configurável.

Exemplos:

- monstros
- regiões
- itens
- habilidades
- chefes

Nenhuma regra de negócio deve ficar aqui.

Apenas dados.

---

## ui

Renderização terminal.

Exemplos:

- menus
- telas
- ansi art
- tabelas
- barras de vida

Nunca implementar lógica de combate aqui.

---

# Princípios Arquiteturais

Seguir SOLID.

Priorizar composição sobre herança.

Evitar singletons.

Preferir funções puras quando possível.

Sempre utilizar interfaces para contratos importantes.

Exemplo:

```typescript
interface Enemy {
  id: string;
  name: string;
  hp: number;
  attack: number;
}
```

---

# Sistema de Dados

Todo conteúdo deve ser data-driven.

Monstros, regiões, equipamentos e habilidades devem ser definidos em arquivos separados.

Exemplo:

```typescript
export const goblin = {
  id: "goblin",
  name: "Goblin",
  hp: 30,
  attack: 5,
};
```

Adicionar novos monstros não deve exigir alteração na engine.

---

# Sistema de Combate

Combate por turnos.

Fluxo:

1. Jogador escolhe ação
2. Ação é executada
3. Inimigo executa ação
4. Verificar vitória ou derrota

Ações possíveis:

- atacar
- habilidade
- item
- fugir

O combate deve ser desacoplado da interface.

A engine nunca deve utilizar console.log diretamente.

Toda saída deve passar pela camada de UI.

---

# Sistema de Progressão

Nível máximo:

```text
50
```

A progressão deve utilizar curva exponencial leve.

Exemplo:

```text
100 XP
250 XP
500 XP
900 XP
1400 XP
...
```

Cada nível aumenta:

- HP
- atributos
- recursos

---

# Equipamentos

Slots:

```text
weapon
helmet
chest
gloves
boots
ring
amulet
```

Raridades:

```text
common
uncommon
rare
epic
legendary
```

Toda raridade deve possuir modificadores próprios.

---

# Sistema de Loot

Loot baseado em tabelas.

Nunca utilizar ifs gigantes para geração de itens.

Utilizar tabelas de probabilidade.

Exemplo:

```typescript
[
  { item: "wood_sword", chance: 50 },
  { item: "iron_sword", chance: 30 },
  { item: "magic_sword", chance: 15 },
  { item: "dragon_sword", chance: 5 },
];
```

---

# ANSI Art

ANSI Art deve ser utilizada apenas para:

- chefes
- título
- game over
- vitória
- regiões

Evitar ANSI Art excessiva durante combate.

A legibilidade é prioridade.

---

# Sistema de Save

Formato:

```text
JSON
```

Arquivo:

```text
save.json
```

Persistir:

- personagem
- inventário
- equipamentos
- progresso
- missões

Salvar automaticamente após eventos importantes.

---

# Tratamento de Erros

Nunca utilizar:

```typescript
catch {}
```

Todo erro deve:

- ser tratado
- possuir mensagem clara
- não quebrar o jogo

---

# Testabilidade

Toda lógica importante deve ser isolada.

Combate deve ser testável sem interface.

Loot deve ser testável sem interface.

Progressão deve ser testável sem interface.

---

# Convenções de Código

Utilizar:

```typescript
camelCase;
```

Para:

- variáveis
- funções

Utilizar:

```typescript
PascalCase;
```

Para:

- classes
- interfaces
- tipos

Utilizar:

```typescript
UPPER_CASE;
```

Para:

- constantes globais

---

# Regras para Claude

Ao implementar funcionalidades:

1. Criar tipos antes da implementação.
2. Implementar lógica antes da interface.
3. Evitar duplicação de código.
4. Reutilizar componentes existentes.
5. Manter responsabilidade única.
6. Atualizar tipos quando necessário.
7. Não criar arquivos temporários desnecessários.
8. Não remover funcionalidades existentes sem solicitação explícita.
9. Sempre preferir soluções simples.
10. Sempre manter o jogo executável.
11. Ao fechar uma task, registrar a conclusão e as decisões em `docs/PROGRESS.md` (ver _Definition of Done_ em `docs/TASKS.md`). Nenhuma task é concluída sem essa entrada.

---

# Roadmap de Implementação

## Fase 1

MVP jogável

- criação de personagem
- classes
- combate
- inimigos
- loot
- inventário
- save

## Fase 2

Conteúdo

- regiões
- chefes
- equipamentos
- habilidades avançadas

## Fase 3

Expansão

- crafting
- eventos
- missões
- comerciantes

## Fase 4

Polimento

- balanceamento
- melhorias visuais
- mais ANSI Art
- otimizações

---

# Objetivo Final

Entregar um RPG de terminal completo, divertido, modular e facilmente expansível, permitindo a adição de novas classes, monstros, regiões e sistemas sem alterações significativas na engine principal.
