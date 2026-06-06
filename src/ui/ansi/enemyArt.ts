/**
 * Arte ASCII de cada inimigo comum, indexada pelo id do inimigo.
 *
 * São pequenas, mas com personalidade. Puras (sem rótulos): o nome
 * localizado é composto pela camada de UI. Inimigos sem arte usam um
 * fallback genérico, mantendo o jogo executável ao adicionar conteúdo.
 */
const ENEMY_ART: Readonly<Record<string, string>> = {
  goblin: ["   ,___,   ", "  ( o,o )  ", "  /)_-_(\\  ", '   " | "   ', "    ^ ^    "].join("\n"),
  wolf: ["  /\\___/\\  ", " ( =^.^= ) ", "  >  Y  <  ", " /  ---  \\ ", '  ""   ""  '].join("\n"),
  skeleton: ["   .----.  ", "  ( o  o ) ", "   |  ^^|  ", "   | === | ", "  /|_||_|\\ "].join("\n"),
  orc: ["   ,-=-.   ", "  /  o o\\  ", "  | \\_/ |  ", "  /]VVV[\\  ", "  ^^   ^^  "].join("\n"),
};

/** Fallback genérico para inimigos sem arte dedicada. */
const FALLBACK_ART = [
  "   ,---.   ",
  "  ( x_x )  ",
  "   )   (   ",
  "  /     \\  ",
  "  ^^   ^^  ",
].join("\n");

/** Renderiza a arte de um inimigo, com fallback genérico se não houver. */
export function renderEnemyArt(enemyId: string): string {
  return ENEMY_ART[enemyId] ?? FALLBACK_ART;
}

/** Indica se existe arte dedicada para o inimigo. */
export function hasEnemyArt(enemyId: string): boolean {
  return enemyId in ENEMY_ART;
}
