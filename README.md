# Terminal Realms

RPG medieval de terminal inspirado em D&D 5e, com combate por turnos, progressão de personagem, loot, equipamentos, exploração e chefes.

## Requisitos

- Node.js >= 18
- Yarn

## Instalação

```bash
yarn install
```

## Como jogar

```bash
yarn build
yarn start
```

No menu principal: **Novo Jogo**, **Continuar** (carrega `save.json`) ou **Sair**.

O MVP é jogável do início até o primeiro chefe (Rei Goblin): crie um personagem (Guerreiro, Arqueiro ou Mago), explore os Campos Iniciais, enfrente inimigos, ganhe XP e loot, e derrote o Rei Goblin.

## Desenvolvimento

```bash
yarn dev          # executa via ts-node
yarn test         # testes em modo watch
yarn test:run     # executa os testes uma vez
yarn check        # formata e corrige com Biome
yarn lint         # lint com Biome
```

Commits seguem Conventional Commits no padrão `tipo(T###): descrição` (validado por commitlint + husky).

## Arquitetura

Código organizado em camadas (ver `docs/ARCHITECTURE.md`):

- `core/` — engine e regras fundamentais (GameEngine, CombatEngine, WorldEngine, progressão)
- `classes/` — classes jogáveis
- `systems/` — sistemas reutilizáveis (inventário, equipamentos, loot, save)
- `content/` — dados do jogo (inimigos, chefes, itens, regiões, eventos)
- `ui/` — renderização de terminal (menus, HUD, ANSI art)
- `types/` — contratos e interfaces
- `utils/` — utilitários puros (random, dice, math)

A documentação de design está em [`docs/`](docs/).
