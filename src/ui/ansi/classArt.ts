import { t } from "../../utils";

/**
 * Arte ASCII de cada classe jogável, indexada pelo classId.
 *
 * As artes são puras (sem rótulos de texto): o nome localizado é
 * composto pela camada de UI a partir de `t("name.<classId>")`.
 */
const CLASS_ART: Readonly<Record<string, string>> = {
  warrior: [
    "    ___    ",
    "   |   |   ",
    "   |[O]|   ",
    "  /|___|\\  ",
    " / |   | \\ ",
    "   |===|   ",
    "   |   |   ",
    "  _|   |_  ",
  ].join("\n"),
  archer: [
    "    )|     ",
    "   ) |     ",
    "  )  |==>  ",
    " )   |     ",
    "  )  |     ",
    "   ) |     ",
    "    )|     ",
    "     |     ",
  ].join("\n"),
  mage: [
    "     /\\    ",
    "    /  \\   ",
    "   / ** \\  ",
    "   \\ ** /  ",
    "    \\  /   ",
    "    |##|   ",
    "    |##|   ",
    "   /____\\  ",
  ].join("\n"),
};

/** Renderiza a arte de uma classe. Lança erro se não houver arte. */
export function renderClassArt(classId: string): string {
  const art = CLASS_ART[classId];
  if (!art) {
    throw new Error(t("error.ansi.noClassArt", { classId }));
  }
  return art;
}
