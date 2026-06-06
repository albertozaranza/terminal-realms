import { t } from "../../utils";

/** Arte ASCII de cada classe jogável, indexada pelo classId. */
const CLASS_ART: Readonly<Record<string, string>> = {
  warrior: ["   /\\   ", "  |==|  ", "  |  |  ", "  |  |  ", " Guerreiro"].join("\n"),
  archer: ["  )|    ", "  )|--> ", "  )|    ", "        ", " Arqueiro"].join("\n"),
  mage: ["   *    ", "  /_\\   ", "   |    ", "   |    ", "   Mago "].join("\n"),
};

/** Renderiza a arte de uma classe. Lança erro se não houver arte. */
export function renderClassArt(classId: string): string {
  const art = CLASS_ART[classId];
  if (!art) {
    throw new Error(t("error.ansi.noClassArt", { classId }));
  }
  return art;
}
