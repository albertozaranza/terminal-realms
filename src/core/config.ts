/**
 * Configuração centralizada do jogo.
 *
 * Constantes globais derivadas de GDD.md, CLAUDE.md e ARCHITECTURE.md.
 * Nenhuma outra camada deve redefinir esses valores.
 */

/** Nome do jogo. */
export const GAME_NAME = "Terminal Realms";

/** Nível máximo do personagem (GDD / progressão). */
export const MAX_LEVEL = 50;

/** Arquivo de save no formato JSON. */
export const SAVE_FILE = "save.json";

/** Id da região inicial (Campos Iniciais). */
export const START_REGION = "starting_fields";

/** Dano mínimo aplicado em qualquer ataque (ARCHITECTURE — fórmula de dano). */
export const MIN_DAMAGE = 1;

/** Moeda oficial do jogo (CONTENT_BIBLE). */
export const CURRENCY = "Gold";

/**
 * Ouro concedido ao vencer um combate, como fração da recompensa de XP do
 * inimigo (sorteado entre mín e máx). Atrela o ganho de ouro à dificuldade:
 * inimigos fracos rendem pouco, chefes rendem muito. Antes era um valor fixo
 * (5–100) que inflacionava a economia (ver balanceamento da FASE 14).
 */
export const GOLD_REWARD_MIN_FACTOR = 0.5;
export const GOLD_REWARD_MAX_FACTOR = 1.0;
