# Terminal Realms

## Game Design Document (GDD)

---

# Visão Geral

**Terminal Realms** é um RPG medieval jogado inteiramente no terminal.

O jogador explora um mundo gerado proceduralmente, enfrenta monstros, coleta equipamentos e evolui seu personagem.

Toda a interface é baseada em texto e ANSI Art, utilizando cores ANSI para representar ambientes, inimigos e eventos.

O sistema de regras é inspirado em D&D 5e, porém simplificado para proporcionar uma experiência rápida e divertida em ambiente terminal.

---

# Objetivos

- Fácil de aprender
- Difícil de dominar
- Progressão viciante
- Combates rápidos
- Exploração recompensadora
- Interface rica utilizando ANSI Art
- Compatibilidade multiplataforma

---

# Plataformas

- macOS
- Linux
- Windows

Execução:

```bash
terminal-realms
```

---

# Classes

## Guerreiro

Especialista em combate corpo a corpo.

### Atributos Base

- HP: Alto
- Defesa: Alta
- Dano: Médio
- Mana: Baixa

### Habilidades

#### Golpe Poderoso

- 150% do dano
- Cooldown: 3 turnos

#### Postura Defensiva

- +50% defesa
- Duração: 2 turnos
- Cooldown: 5 turnos

---

## Arqueiro

Especialista em ataques à distância.

### Atributos Base

- HP: Médio
- Defesa: Baixa
- Dano: Alto
- Mana: Média

### Habilidades

#### Disparo Preciso

- 200% do dano
- Chance crítica aumentada
- Cooldown: 4 turnos

#### Chuva de Flechas

- Dano em todos os inimigos
- Cooldown: 6 turnos

---

## Mago

Especialista em magia ofensiva.

### Atributos Base

- HP: Baixo
- Defesa: Baixa
- Mana: Muito Alta
- Dano: Muito Alto

### Habilidades

#### Bola de Fogo

- Dano em área

#### Raio Arcano

- Dano elevado em alvo único

#### Escudo Arcano

- Redução temporária de dano

---

# Sistema de Atributos

Todos os personagens possuem:

```text
HP
Mana
Força
Destreza
Inteligência
Defesa
Velocidade
Nível
Experiência
```

---

# Progressão

Nível máximo: 50

Ao subir de nível:

- HP aumenta
- Mana aumenta
- Atributos aumentam
- Habilidades podem ser desbloqueadas
- Dificuldade escala gradualmente

---

# Equipamentos

## Slots

```text
Arma
Capacete
Peitoral
Luvas
Botas
Anel
Amuleto
```

## Raridades

| Raridade | Cor ANSI |
| -------- | -------- |
| Comum    | Branco   |
| Incomum  | Verde    |
| Raro     | Azul     |
| Épico    | Roxo     |
| Lendário | Amarelo  |

---

# Inimigos

## Categorias

```text
Animal
Humanoide
Morto-vivo
Demônio
Dragão
```

Cada categoria possui:

- Estatísticas próprias
- Tabela de loot
- Habilidades específicas

---

# Chefes

Cada região possui um chefe principal.

## Exemplos

- Rei Goblin
- Necromante Sombrio
- Dragão Vermelho
- Senhor Demoníaco

Chefes possuem:

- Mecânicas exclusivas
- Loot garantido
- Progressão da campanha

---

# Mundo

## Regiões

### Campos Iniciais

Nível 1–5

### Floresta Sombria

Nível 5–15

### Montanhas Congeladas

Nível 15–25

### Pântano Maldito

Nível 25–35

### Terras Infernais

Nível 35–50

---

# Exploração

Movimentação:

```text
W = Norte
A = Oeste
S = Sul
D = Leste
```

Ao explorar, podem ocorrer:

- Combates
- Eventos aleatórios
- NPCs
- Baús
- Lojas
- Descobertas especiais

---

# Eventos Aleatórios

Exemplos:

- Mercador ambulante
- Emboscada
- Altar antigo
- Tesouro escondido
- Viajante perdido
- Armadilha

---

# NPCs

## Tipos

```text
Mercador
Ferreiro
Curandeiro
Treinador
Guardião Regional
```

---

# Sistema de Missões

## Missão Principal

Derrotar todos os chefes regionais e enfrentar o chefe final.

## Missões Secundárias

- Eliminar monstros
- Coletar recursos
- Recuperar artefatos
- Escoltar NPCs
- Explorar regiões

---

# Sistema de Save

Formato:

```text
save.json
```

Dados armazenados:

- Personagem
- Inventário
- Equipamentos
- Região atual
- Missões
- Estatísticas gerais

Salvamento automático após:

- Combates
- Evolução de nível
- Mudança de região

---

# Interface ANSI

Elementos que devem possuir ANSI Art:

- Tela inicial
- Seleção de classe
- Inimigos
- Chefes
- Baús
- Vilas
- Tela de vitória
- Tela de derrota

---

# Loop Principal

```text
Criar Personagem
        ↓
Escolher Classe
        ↓
Explorar Região
        ↓
Encontrar Eventos
        ↓
Combater Inimigos
        ↓
Obter Loot
        ↓
Subir de Nível
        ↓
Derrotar Chefe
        ↓
Nova Região
        ↓
Chefe Final
        ↓
Fim do Jogo
```

---

# Especificação Técnica

## Stack

```text
Node.js
TypeScript
Commander
Inquirer
Chalk
Figlet
Boxen
Cli-Table3
LowDB
```

---

# Estrutura do Projeto

```text
src/
├── core/
│   ├── game.ts
│   ├── combat.ts
│   ├── player.ts
│   ├── enemy.ts
│   └── world.ts
│
├── classes/
│   ├── warrior.ts
│   ├── archer.ts
│   └── mage.ts
│
├── systems/
│   ├── inventory.ts
│   ├── equipment.ts
│   ├── quests.ts
│   ├── loot.ts
│   └── save.ts
│
├── content/
│   ├── enemies.ts
│   ├── bosses.ts
│   ├── items.ts
│   ├── skills.ts
│   └── regions.ts
│
├── ui/
│   ├── ansi.ts
│   ├── menus.ts
│   ├── screens.ts
│   └── renderer.ts
│
└── index.ts
```

---

# Requisitos do MVP

## Obrigatórios

- Criar personagem
- Escolher classe
- Sistema de combate
- Sistema de níveis
- Equipamentos
- Loot aleatório
- Exploração
- Save/Load
- Chefes regionais
- ANSI Art básica

## Pós-MVP

- Crafting
- Guildas
- Pets
- Eventos sazonais
- Ranking local
- Modo Hardcore

---

# Prompt para Claude

Crie um RPG de terminal completo chamado "Terminal Realms" utilizando Node.js e TypeScript.

O jogo deve ser inspirado em D&D 5e simplificado, possuir as classes Guerreiro, Arqueiro e Mago, combate por turnos, progressão até nível 50, exploração procedural, sistema de equipamentos, inventário, missões, chefes regionais, save/load automático e interface rica em ANSI Art.

Utilize arquitetura modular, tipagem forte, princípios SOLID e separação clara entre engine, conteúdo e interface.

O projeto deve ser totalmente funcional via terminal e pronto para execução através de yarn install e yarn start.

Implemente inicialmente um MVP completo e jogável e posteriormente expanda o conteúdo através de arquivos de configuração para permitir a adição de novos monstros, regiões, itens e habilidades sem alterar a engine principal.
