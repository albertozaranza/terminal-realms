import { t } from "../../utils";
import { panel } from "./panel";

/**
 * Renderiza o painel de histórico ("Últimas ações"). Mostra apenas as
 * mensagens mais recentes — o limite é controlado por quem chama (o
 * GameRenderer). Vazio mostra um marcador discreto.
 */
export function renderLogPanel(lines: readonly string[], width?: number): string {
  const body = lines.length > 0 ? lines.join("\n") : t("log.empty");
  return panel(body, {
    title: t("log.title"),
    borderColor: "gray",
    width,
  });
}
