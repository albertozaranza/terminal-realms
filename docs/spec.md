# PROMPT_DYNAMIC_WORLD_AND_DISCOVERY.md

Você é um Game Designer Sênior especializado em RPGs, Roguelites, CRPGs e jogos narrativos focados em exploração.

Sua missão é redesenhar completamente o sistema de exploração, regiões, NPCs e progressão de mundo do projeto **Terminal Realms**.

O objetivo é criar uma sensação constante de descoberta, aventura e investigação.

---

# Visão Geral

O jogador NÃO deve explorar o mundo utilizando:

- WASD
- movimentação em grid
- movimentação tile-based
- mapas estilo roguelike

O jogador NÃO controla um personagem andando pelo mapa.

Em vez disso, o mundo deve ser explorado através da descoberta progressiva de locais, NPCs, eventos e informações.

A exploração deve ser baseada em conhecimento.

O jogador descobre o mundo conforme joga.

---

# Filosofia Principal

O jogador nunca deve enxergar uma região inteira ao entrar nela.

Uma região deve parecer misteriosa.

O jogador deve se perguntar:

- O que existe aqui?
- Quem controla essa região?
- Quais perigos existem?
- Quem posso confiar?
- Onde está o chefe?
- Como chegar até ele?

A resposta para essas perguntas deve surgir gradualmente.

---

# Estrutura do Mundo

O mundo é dividido em:

```text
Mundo
 └── Regiões
      └── Pontos de Interesse (POIs)
```

---

# Mapa Mundial

O mapa mundial mostra apenas regiões conhecidas.

Exemplo:

```text
╔══════════════════════════════════════╗
║           MAPA MUNDIAL              ║
╚══════════════════════════════════════╝

             ❓
              │
              │
🏰 Campos Iniciais
              │
              │
             ❓
```

O jogador deve descobrir novas regiões durante a campanha.

Regiões futuras não devem ser reveladas antecipadamente.

---

# Regiões

Cada região funciona como uma rede dinâmica de locais.

O jogador não vê todos os locais imediatamente.

Locais aparecem conforme são descobertos.

---

# Pontos de Interesse (POIs)

Exemplos:

```text
🏰 Vila
🧙 NPC
💰 Loja
⚒ Ferreiro
⚔ Missão
❓ Evento
🏚 Ruína
🪦 Cripta
🌲 Bosque
👑 Chefe
```

Cada local possui:

- Nome
- Descrição
- Estado
- NPCs
- Eventos
- Requisitos
- Possíveis descobertas

---

# Sistema de Descoberta

Locais começam ocultos.

Estado inicial:

```text
❓ Desconhecido
```

O jogador descobre locais através de:

- Conversas
- Missões
- Eventos
- Rumores
- Investigações
- Exploração de locais conhecidos

---

# Estados dos Locais

Todo local deve possuir um estado.

```text
UNDISCOVERED
DISCOVERED
AVAILABLE
COMPLETED
LOCKED
```

Representação visual:

```text
❓ Não descoberto
🌲 Descoberto
⚔ Disponível
✅ Concluído
🔒 Bloqueado
```

---

# Mapa de Região Dinâmico

O mapa deve crescer conforme o jogador adquire conhecimento.

Exemplo inicial:

```text
🏰 Vila Oakheart

└── ⚔ Estrada Principal
```

Após conversar com NPCs:

```text
🏰 Vila Oakheart

├── ⚔ Estrada Principal
│
├── 🌲 Bosque Sombrio
│
└── ❓ Local Misterioso
```

Após novas descobertas:

```text
🏰 Vila Oakheart

├── ✅ Estrada Principal
│
├── 🌲 Bosque Sombrio
│   │
│   └── 🏚 Ruínas Antigas
│
├── 🧙 Caçador
│
└── 💰 Mercador Ambulante
```

O mapa deve atualizar em tempo real.

---

# Descobertas em Cadeia

Locais devem revelar outros locais.

Exemplo:

```text
Bosque Sombrio
```

revela

```text
Ruínas Antigas
```

que revela

```text
Cripta Esquecida
```

que revela

```text
Necromante da Floresta
```

O jogador deve montar mentalmente a região.

---

# NPCs

NPCs não devem ser apenas vendedores.

NPCs são fontes de conhecimento.

Todo NPC deve possuir:

- Nome
- Personalidade
- História
- Conhecimento próprio
- Relações com outros NPCs

---

# Sistema de Diálogos

Diálogos devem possuir opções.

Exemplo:

```text
1. O que há nesta região?
2. Você conhece as ruínas?
3. Quem governa estas terras?
4. Ouvi falar de desaparecimentos.
5. Encerrar conversa.
```

---

# Revelação de Informações

Conversas podem revelar:

- Novos locais
- Novas missões
- Rumores
- Histórias
- Fraquezas de chefes
- Segredos

Exemplo:

```text
🌲 Bosque Sombrio descoberto.
```

ou

```text
📖 Novo conhecimento adquirido:
"A entrada da cripta fica atrás da cachoeira."
```

---

# Sistema de Conhecimento

O jogador possui um diário.

Exemplo:

```text
Conhecimentos da Região

☑ Existem goblins atacando viajantes.

☑ Um necromante foi visto na floresta.

☑ Há uma cripta antiga.

☐ Localização da cripta.

☐ Fraqueza do necromante.
```

Conhecimento é uma mecânica importante.

Não é apenas texto decorativo.

Conhecimento deve desbloquear:

- Locais
- Missões
- Opções de diálogo
- Eventos
- Chefes

---

# Missões

Missões devem surgir organicamente.

Não utilizar apenas:

```text
Mate 10 goblins.
```

Criar missões baseadas em investigação.

Exemplos:

- Descobrir quem está sequestrando viajantes
- Encontrar um caçador desaparecido
- Investigar ruínas antigas
- Descobrir a origem de uma maldição

---

# Chefes

Chefes não devem aparecer imediatamente.

O jogador deve descobrir:

- Que eles existem
- Onde estão
- Como alcançá-los

Exemplo:

```text
👑 Necromante da Floresta
🔒 Localização desconhecida
```

Posteriormente:

```text
👑 Necromante da Floresta
🔒 Requer descobrir entrada da cripta
```

Posteriormente:

```text
👑 Necromante da Floresta
⚔ Disponível
```

---

# Interface

O mapa deve ser visual.

Utilizar:

- árvores ASCII
- conexões
- ícones
- estados visuais

Exemplo:

```text
🏰 Vila Hollow

├── ✅ Covil dos Lobos
│
├── ⚔ Ruínas Antigas
│
├── 🧙 Eremita
│
├── 💰 Mercador
│
└── 👑 Necromante
    🔒 Requer Cripta Esquecida
```

---

# Progressão da Região

O jogador nunca deve ver:

```text
100% concluído
```

logo ao entrar.

O conteúdo deve ser revelado gradualmente.

A sensação deve ser:

```text
descoberta
→ investigação
→ conhecimento
→ desbloqueios
→ confronto
```

---

# Objetivo de Experiência

O jogador deve sentir que está desvendando uma região viva.

Conversar com NPCs deve ser tão importante quanto lutar.

Descobrir informações deve ser tão recompensador quanto encontrar itens.

A região deve parecer um mistério a ser resolvido.

Ao terminar uma região, o jogador deve sentir que realmente a conheceu.

---

# Critério de Sucesso

O sistema deve fazer o jogador:

- Conversar com NPCs voluntariamente
- Buscar informações
- Investigar rumores
- Descobrir locais escondidos
- Desbloquear caminhos
- Resolver mistérios regionais

A progressão deve parecer uma aventura narrativa, não apenas uma sequência de combates.
