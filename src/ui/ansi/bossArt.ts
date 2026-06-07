import { t } from "../../utils";

/**
 * Arte ASCII de cada chefe, indexada pelo id do chefe.
 *
 * As artes de chefe são maiores e mais imponentes que as de inimigos
 * comuns, para reforçar a sensação de um encontro importante. São puras
 * (sem rótulos): o nome localizado é composto pela camada de UI.
 */
const BOSS_ART: Readonly<Record<string, string>> = {
  goblin_king: [
    "        .-=========-.        ",
    "        \\'-=======-'/        ",
    "        _|  .---.  |_        ",
    "       ((|  (o o)  |))       ",
    "        \\|   ^^^   |/        ",
    "         \\  '---'  /         ",
    "       .--`-.___.-'--.       ",
    "      /  /|       |\\  \\      ",
    "     /  / |  WAR  | \\  \\     ",
    "    |__/  |_______|  \\__|    ",
    "         /__|   |__\\         ",
    "        (___)   (___)        ",
  ].join("\n"),
  forest_necromancer: [
    '          .-"""""-.          ',
    "         /  _   _  \\         ",
    "        |  (X) (X)  |        ",
    "        |     <     |        ",
    "         \\  \\___/  /         ",
    "        .-`~~|||~~`-.        ",
    "       / †  /|||\\  † \\       ",
    "      |   /  |||  \\   |      ",
    "      |  | .-'''-. |  |      ",
    "       \\ |/  ☠ ☠  \\| /       ",
    "        \\|  ' --- '|/        ",
    "         `--.___.--`         ",
  ].join("\n"),
};

/** Renderiza a arte de um chefe. Lança erro se não houver arte. */
export function renderBossArt(bossId: string): string {
  const art = BOSS_ART[bossId];
  if (!art) {
    throw new Error(t("error.ansi.noBossArt", { bossId }));
  }
  return art;
}
