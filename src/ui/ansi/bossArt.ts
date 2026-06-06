/** Arte ASCII de cada chefe, indexada pelo id do chefe. */
const BOSS_ART: Readonly<Record<string, string>> = {
  goblin_king: [
    "    ,~~.    ",
    "   ( o o )  ",
    "  /   ^   \\ ",
    " |  \\___/  |",
    "  \\_______/ ",
    "  REI GOBLIN",
  ].join("\n"),
};

/** Renderiza a arte de um chefe. Lança erro se não houver arte. */
export function renderBossArt(bossId: string): string {
  const art = BOSS_ART[bossId];
  if (!art) {
    throw new Error(`renderBossArt: não há arte para o chefe "${bossId}".`);
  }
  return art;
}
