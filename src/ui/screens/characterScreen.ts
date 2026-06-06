import chalk from "chalk";
import type { CharacterClass } from "../../types";
import { t } from "../../utils";
import { renderClassArt } from "../ansi";
import { center, columns, panel, visibleLength } from "../components";

/** Tela de introdução da criação de personagem (passo do nome). */
export function renderCreationIntro(width: number): string {
  const body = `⚔  ${t("screen.create.title")}  ⚔\n\n${t("screen.create.hint")}`;
  return panel(body, { width, align: "center", borderColor: "yellow" });
}

/** Galeria com a arte e o nome de cada classe jogável. */
export function renderClassGallery(classes: readonly CharacterClass[], width: number): string {
  const cards = classes.map((characterClass) => {
    const art = renderClassArt(characterClass.id);
    const cardWidth = Math.max(...art.split("\n").map(visibleLength));
    const label = chalk.bold.cyan(center(t(`name.${characterClass.id}`), cardWidth));
    return `${art}\n\n${label}`;
  });
  const gallery = columns(cards, 4);
  return panel(gallery, {
    title: t("prompt.chooseClass"),
    width,
    align: "center",
    borderColor: "cyan",
  });
}

/** Tela de seleção de idioma. */
export function renderLanguageScreen(width: number): string {
  return panel(`🌐  ${t("prompt.chooseLanguage")}`, {
    width,
    align: "center",
    borderColor: "green",
  });
}
