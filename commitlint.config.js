/**
 * Padroniza as mensagens de commit no formato Conventional Commits com
 * escopo obrigatório.
 *
 * Padrão esperado:
 *
 *   tipo(T###): descrição
 *   ex.: feat(T001): inicializar projeto
 *
 * O escopo deve ser o id de uma task (T seguido de 3 dígitos) ou um
 * escopo de infraestrutura para commits que não pertencem a uma task.
 */
const TASK_SCOPE = /^T\d{3}$/;
const META_SCOPES = ["repo", "deps", "tooling", "docs", "ci", "release"];

module.exports = {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "scope-task-or-meta": ({ scope }) => {
          if (scope && (TASK_SCOPE.test(scope) || META_SCOPES.includes(scope))) {
            return [true];
          }
          return [
            false,
            `escopo inválido: use o id da task no formato T### (ex.: T001) ou um escopo de infra (${META_SCOPES.join(", ")})`,
          ];
        },
      },
    },
  ],
  rules: {
    // Escopo é obrigatório.
    "scope-empty": [2, "never"],
    // Permite o "T" maiúsculo do id da task.
    "scope-case": [0],
    // Valida o formato do escopo (task ou infra).
    "scope-task-or-meta": [2, "always"],
  },
};
