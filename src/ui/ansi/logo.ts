import figlet from "figlet";

/** Renderiza o logo do jogo em ASCII art (figlet). */
export function renderLogo(text = "Terminal Realms"): string {
  return figlet.textSync(text, { font: "Standard" });
}
