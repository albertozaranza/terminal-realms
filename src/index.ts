/**
 * Terminal Realms — ponto de entrada.
 *
 * Os imports abaixo validam a estrutura de diretórios (T002) e a
 * resolução de módulos entre as camadas. O conteúdo de cada camada
 * será implementado nas tarefas seguintes.
 */
import "./types";
import "./utils";
import "./core";
import "./classes";
import "./systems";
import "./content";
import "./ui";

/** Mensagem exibida na inicialização do jogo. Função pura para ser testável. */
export function getStartupMessage(): string {
  return "Terminal Realms — projeto inicializado.";
}

export function main(): void {
  console.log(getStartupMessage());
}

// Executa apenas quando rodado diretamente (não durante import em testes).
if (require.main === module) {
  main();
}
