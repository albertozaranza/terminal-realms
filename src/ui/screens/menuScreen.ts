import chalk from "chalk";
import { t } from "../../utils";
import { renderLogo } from "../ansi";
import { center, panel } from "../components";

/** Desenha a tela do menu principal: logo + subtítulo decorado. */
export function renderMenuScreen(width: number): string {
  const logo = chalk.cyanBright(center(renderLogo(), width));
  const tagline = panel(t("menu.tagline"), {
    width,
    align: "center",
    borderColor: "magenta",
  });
  return [logo, "", tagline].join("\n");
}
