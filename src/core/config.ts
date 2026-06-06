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
export const START_REGION = "campos_iniciais";

/** Dano mínimo aplicado em qualquer ataque (ARCHITECTURE — fórmula de dano). */
export const MIN_DAMAGE = 1;

/** Moeda oficial do jogo (CONTENT_BIBLE). */
export const CURRENCY = "Gold";
