/**
 * Sistema de internacionalização (i18n).
 *
 * Vive na camada utils (sem dependências) para ser acessível por todas
 * as camadas, inclusive nos lançamentos de erro. O idioma atual é um
 * estado de módulo; mensagens são resolvidas em tempo de chamada, então
 * trocar o idioma afeta toda saída subsequente (incluindo erros).
 *
 * Os catálogos de cada idioma ficam em arquivos isolados em ./locales.
 */
import { en } from "./locales/en";
import { ptBR } from "./locales/ptBR";

/** Idiomas suportados. */
export type Language = "pt-BR" | "en";

/** Idioma padrão. */
export const DEFAULT_LANGUAGE: Language = "pt-BR";

/** Idiomas disponíveis. */
export const SUPPORTED_LANGUAGES: readonly Language[] = ["pt-BR", "en"];

/** Parâmetros de interpolação de uma mensagem. */
export type TranslationParams = Record<string, string | number>;

/** Catálogo de traduções: chave -> texto. */
export type TranslationCatalog = Record<string, string>;

const catalogs: Record<Language, TranslationCatalog> = {
  "pt-BR": ptBR,
  en,
};

let currentLanguage: Language = DEFAULT_LANGUAGE;

/** Idioma atual. */
export function getLanguage(): Language {
  return currentLanguage;
}

/** Define o idioma atual. */
export function setLanguage(language: Language): void {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new Error(t("error.i18n.unsupportedLanguage", { language }));
  }
  currentLanguage = language;
}

/** Mescla entradas de tradução em um idioma (usado por módulos de locale). */
export function registerTranslations(language: Language, entries: TranslationCatalog): void {
  Object.assign(catalogs[language], entries);
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const value = params[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

/**
 * Traduz uma chave para o idioma atual, interpolando parâmetros.
 * Faz fallback para o idioma padrão e, por fim, para a própria chave.
 */
export function t(key: string, params?: TranslationParams): string {
  const template = catalogs[currentLanguage][key] ?? catalogs[DEFAULT_LANGUAGE][key] ?? key;
  return interpolate(template, params);
}
