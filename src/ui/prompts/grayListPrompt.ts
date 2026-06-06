/**
 * List prompt customizado do inquirer.
 *
 * O list padrão renderiza itens desabilitados como `- Nome (motivo)`.
 * Aqui trocamos o traço por uma cor cinza, deixando o item esmaecido
 * (em vez de prefixado com `-`) para indicar indisponibilidade — usado,
 * por exemplo, em habilidades em cooldown ou sem mana no combate.
 */
import chalk from "chalk";
import figures from "figures";
import ListPrompt from "inquirer/lib/prompts/list.js";

/** Renderiza as escolhas; idêntico ao inquirer, exceto itens desabilitados. */
// biome-ignore lint/suspicious/noExplicitAny: estruturas internas do inquirer não são tipadas
function listRender(choices: any, pointer: number): string {
  let output = "";
  let separatorOffset = 0;

  // biome-ignore lint/suspicious/noExplicitAny: choice é interno do inquirer
  choices.forEach((choice: any, i: number) => {
    if (choice.type === "separator") {
      separatorOffset++;
      output += `  ${choice}\n`;
      return;
    }

    if (choice.disabled) {
      separatorOffset++;
      const reason = typeof choice.disabled === "string" ? choice.disabled : "Disabled";
      // Esmaecido em cinza, sem o traço `- ` do inquirer padrão.
      output += `  ${chalk.gray(`${choice.name} (${reason})`)}\n`;
      return;
    }

    const isSelected = i - separatorOffset === pointer;
    let line = (isSelected ? `${figures.pointer} ` : "  ") + choice.name;
    if (isSelected) {
      line = chalk.cyan(line);
    }

    output += `${line} \n`;
  });

  return output.replace(/\n$/, "");
}

/** ListPrompt que esmaece (cinza) os itens indisponíveis em vez de prefixá-los com `-`. */
export class GrayListPrompt extends ListPrompt {
  render(): void {
    let message = this.getQuestion();

    if (this.firstRender) {
      message += chalk.dim("(Use arrow keys)");
    }

    // As estruturas internas do inquirer não são tipadas de forma utilizável aqui.
    // biome-ignore lint/suspicious/noExplicitAny: acesso a internos do inquirer
    const choices = this.opt.choices as any;
    // biome-ignore lint/suspicious/noExplicitAny: paginator interno do inquirer
    const paginator = this.paginator as any;

    if (this.status === "answered") {
      message += chalk.cyan(choices.getChoice(this.selected).short);
    } else {
      const choicesStr = listRender(choices, this.selected);
      const indexPosition = choices.indexOf(choices.getChoice(this.selected));
      const realIndexPosition =
        // biome-ignore lint/suspicious/noExplicitAny: reduce sobre escolhas internas do inquirer
        choices.reduce((acc: number, value: any, i: number) => {
          if (i > indexPosition) {
            return acc;
          }
          if (value.type === "separator") {
            return acc + 1;
          }
          let l = value.name;
          if (typeof l !== "string") {
            return acc + 1;
          }
          l = l.split("\n");
          return acc + l.length;
        }, 0) - 1;
      message += `\n${paginator.paginate(choicesStr, realIndexPosition, this.opt.pageSize)}`;
    }

    this.firstRender = false;
    this.screen.render(message, "");
  }
}
