import chalk from "chalk";
import { getKnownFacts, isObjectiveComplete, knowledgeProgress } from "../../systems";
import type { LocationState, Quest, Region } from "../../types";
import { t } from "../../utils";
import { panel } from "../components";

/** Dados para desenhar o diário da região. */
export interface JournalScreenView {
  region: Region;
  /** Conhecimentos adquiridos (ids). */
  known: readonly string[];
  /** Missão de investigação ativa (opcional). */
  quest?: Quest;
  /** Estados dos locais (para avaliar objetivos por local). */
  locationStates: Record<string, LocationState>;
}

/**
 * Diário da região: conhecimentos adquiridos (☑) e os objetivos da
 * investigação (☑ concluídos / ☐ pendentes). Usa seletores puros do sistema
 * de diário; não implementa regra de negócio.
 */
export function renderJournalScreen(view: JournalScreenView, width: number): string {
  const facts = getKnownFacts(view.region, view.known);
  const progress = knowledgeProgress(view.region, view.known);

  const factLines = facts.length
    ? facts.map((fact) => chalk.green(`☑ ${t(fact.text)}`)).join("\n")
    : chalk.gray(t("journal.empty"));

  const sections = [
    `${chalk.bold(t("journal.knowledge"))}  ${chalk.gray(`(${progress.known}/${progress.total})`)}`,
    factLines,
  ];

  if (view.quest) {
    const objectives = (view.quest.objectives ?? [])
      .map((objective) => {
        const done = isObjectiveComplete(objective, view.known, view.locationStates);
        return done
          ? chalk.green(`☑ ${t(objective.description)}`)
          : chalk.gray(`☐ ${t(objective.description)}`);
      })
      .join("\n");
    sections.push(
      "",
      chalk.bold(t(view.quest.name)),
      chalk.gray(t(view.quest.description)),
      objectives,
    );
  }

  return panel(sections.join("\n"), {
    title: t("journal.title"),
    width,
    borderColor: "yellow",
  });
}
