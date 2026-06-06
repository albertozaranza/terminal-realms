import { renderLogPanel } from "../components";

/** Sequência ANSI: limpa a tela, o histórico de rolagem e leva o cursor ao topo. */
const CLEAR_SCREEN = `${String.fromCharCode(27)}[2J${String.fromCharCode(27)}[3J${String.fromCharCode(27)}[H`;

/** Esconde/mostra o cursor do terminal. */
const HIDE_CURSOR = `${String.fromCharCode(27)}[?25l`;
const SHOW_CURSOR = `${String.fromCharCode(27)}[?25h`;

/** Largura mínima e máxima do conteúdo renderado. */
const MIN_WIDTH = 60;
const MAX_WIDTH = 100;

/** Quantidade de mensagens mantidas no painel de histórico. */
const DEFAULT_LOG_LIMIT = 6;

/**
 * Renderizador de tela do jogo.
 *
 * Mantém a interface como uma aplicação de tela cheia: a cada mudança de
 * estado a tela inteira é limpa e redesenhada (cena atual + painel de
 * histórico), em vez de acumular linhas indefinidamente. A UI nunca
 * escreve direto no terminal — toda saída passa por este renderer.
 */
export class GameRenderer {
  private readonly out: NodeJS.WriteStream;
  private readonly logLimit: number;
  private readonly startedAt: number;
  private logLines: string[] = [];
  private scene = "";

  constructor(out: NodeJS.WriteStream = process.stdout, logLimit = DEFAULT_LOG_LIMIT) {
    this.out = out;
    this.logLimit = logLimit;
    this.startedAt = Date.now();
  }

  /** Largura disponível para o conteúdo, dentro de limites estáveis. */
  get width(): number {
    const columns = this.out.columns ?? 80;
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, columns - 2));
  }

  /** Define a cena (área principal) sem repintar. */
  setScene(body: string): void {
    this.scene = body;
  }

  /** Acrescenta uma mensagem ao histórico, descartando as mais antigas. */
  pushLog(text: string): void {
    for (const rawLine of text.split("\n")) {
      const line = rawLine.trimEnd();
      if (line.trim().length > 0) {
        this.logLines.push(line);
      }
    }
    while (this.logLines.length > this.logLimit) {
      this.logLines.shift();
    }
  }

  /** Esvazia o histórico (ex.: ao voltar ao menu principal). */
  resetLog(): void {
    this.logLines = [];
  }

  /** Limpa a tela inteira. */
  clear(): void {
    this.out.write(CLEAR_SCREEN);
  }

  /**
   * Redesenha a tela inteira: limpa e escreve cena + histórico em uma
   * única operação. Se `body` for informado, ele passa a ser a cena atual.
   */
  paint(body?: string): void {
    if (body !== undefined) {
      this.scene = body;
    }
    const frame = [this.scene, renderLogPanel(this.logLines, this.width)]
      .filter((part) => part.length > 0)
      .join("\n");
    this.out.write(`${CLEAR_SCREEN}${HIDE_CURSOR}${frame}\n${SHOW_CURSOR}`);
  }

  /**
   * Escreve uma tela "terminal" (game over / vitória) sem o painel de
   * histórico e sem manter estado de cena.
   */
  paintRaw(body: string): void {
    this.out.write(`${CLEAR_SCREEN}${body}\n`);
  }

  /** Tempo de jogo decorrido, formatado como mm:ss. */
  elapsed(): string {
    const totalSeconds = Math.floor((Date.now() - this.startedAt) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
}
