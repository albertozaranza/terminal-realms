/**
 * Identidade visual de cada região: uma faixa de "tiles" temáticos e uma
 * cor de borda. Indexada pelo id da região, com fallback genérico para
 * manter o jogo executável ao adicionar novas regiões.
 */
export interface RegionTheme {
  /** Linha de tiles decorativos que caracteriza o ambiente. */
  tile: string;
  /** Cor de borda (nomes aceitos por chalk/boxen). */
  color: string;
}

const REGION_THEMES: Readonly<Record<string, RegionTheme>> = {
  starting_fields: { tile: "🌾", color: "green" },
  dark_forest: { tile: "🌲", color: "greenBright" },
  frozen_mountains: { tile: "❄ ", color: "cyan" },
  cursed_swamp: { tile: "☣ ", color: "magenta" },
  infernal_lands: { tile: "🔥", color: "red" },
};

const FALLBACK_THEME: RegionTheme = { tile: "·", color: "gray" };

/** Tema visual de uma região (com fallback genérico). */
export function regionTheme(regionId: string): RegionTheme {
  return REGION_THEMES[regionId] ?? FALLBACK_THEME;
}

/** Faixa decorativa de tiles repetidos que cabe na largura informada. */
export function regionBand(regionId: string, count = 9): string {
  const { tile } = regionTheme(regionId);
  return Array.from({ length: count }, () => tile).join(" ");
}
