import boxen, { type Options } from "boxen";

/**
 * Padrao que casa com sequencias de cor ANSI (chalk), incluindo o
 * caractere ESC. Construido via RegExp para nao embutir um caractere de
 * controle no codigo-fonte.
 */
const ANSI_PATTERN = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");

/**
 * Seletores de variacao (U+FE00–U+FE0F). Sao caracteres de largura zero que
 * o `.length` conta, mas o terminal nao desenha — precisam ser ignorados na
 * medicao de largura.
 */
const VARIATION_SELECTOR_PATTERN = /[\uFE00-\uFE0F]/g;

/**
 * Comprimento visivel de uma linha (ignora codigos de cor ANSI e seletores de
 * variacao). Emojis como `🛣️`/`🏚️` carregam um seletor de variacao (U+FE0F)
 * que conta como +1 em `.length` sem ocupar coluna no terminal — sem remove-lo,
 * a borda do painel desalinha justamente nas linhas com esses icones.
 */
export function visibleLength(text: string): number {
  return text.replace(ANSI_PATTERN, "").replace(VARIATION_SELECTOR_PATTERN, "").length;
}

/** Preenche a direita ate atingir a largura visivel desejada. */
function padRight(line: string, width: number): string {
  const pad = Math.max(0, width - visibleLength(line));
  return line + " ".repeat(pad);
}

/** Centraliza uma unica linha dentro da largura informada. */
function centerLine(line: string, width: number): string {
  const space = Math.max(0, width - visibleLength(line));
  const left = Math.floor(space / 2);
  return " ".repeat(left) + line + " ".repeat(space - left);
}

/** Opcoes de um painel decorado. */
export interface PanelOptions {
  title?: string;
  borderColor?: string;
  align?: "left" | "center";
  /** Largura total do painel (inclui bordas e padding). */
  width?: number;
}

/** Renderiza um conteudo dentro de uma moldura (boxen). */
export function panel(body: string, options: PanelOptions = {}): string {
  let content = body;
  if (options.width !== undefined) {
    // 2 colunas de borda + 2 de padding horizontal.
    const inner = Math.max(1, options.width - 4);
    content = body
      .split("\n")
      .map((line) => (options.align === "center" ? centerLine(line, inner) : padRight(line, inner)))
      .join("\n");
  }
  const boxenOptions: Options = {
    padding: { top: 0, bottom: 0, left: 1, right: 1 },
    borderStyle: "round",
    borderColor: options.borderColor ?? "cyan",
    title: options.title,
    titleAlignment: "center",
  };
  return boxen(content, boxenOptions);
}

/** Centraliza cada linha de um texto dentro da largura informada. */
export function center(text: string, width: number): string {
  return text
    .split("\n")
    .map((line) => {
      const pad = Math.max(0, Math.floor((width - visibleLength(line)) / 2));
      return " ".repeat(pad) + line;
    })
    .join("\n");
}

/** Linha divisoria horizontal. */
export function divider(width: number, char = "─"): string {
  return char.repeat(Math.max(0, width));
}

/**
 * Junta varios blocos multilinha lado a lado, alinhando-os pelo topo e
 * preenchendo com espacos para manter as colunas retas.
 */
export function columns(blocks: readonly string[], gap = 3): string {
  const split = blocks.map((block) => block.split("\n"));
  const widths = split.map((lines) => Math.max(...lines.map(visibleLength)));
  const height = Math.max(...split.map((lines) => lines.length));
  const spacer = " ".repeat(gap);

  const rows: string[] = [];
  for (let row = 0; row < height; row++) {
    const cells = split.map((lines, col) => {
      const line = lines[row] ?? "";
      return line + " ".repeat(Math.max(0, widths[col] - visibleLength(line)));
    });
    rows.push(cells.join(spacer));
  }
  return rows.join("\n");
}
