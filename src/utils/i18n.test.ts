import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_LANGUAGE, getLanguage, setLanguage, t } from "./i18n";
import { randomInt } from "./random";

afterEach(() => {
  setLanguage(DEFAULT_LANGUAGE);
});

describe("i18n", () => {
  it("starts in the default language", () => {
    expect(getLanguage()).toBe(DEFAULT_LANGUAGE);
  });

  it("translates a key in the current language", () => {
    expect(t("app.title")).toBe("Terminal Realms");
  });

  it("switches language and reflects it in translations", () => {
    setLanguage("en");
    expect(getLanguage()).toBe("en");
    expect(t("common.greeting", { name: "Ana" })).toBe("Hello, Ana!");
    setLanguage("pt-BR");
    expect(t("common.greeting", { name: "Ana" })).toBe("Olá, Ana!");
  });

  it("interpolates parameters", () => {
    expect(t("common.greeting", { name: "Bob" })).toBe("Olá, Bob!");
  });

  it("falls back to the key when missing", () => {
    expect(t("missing.key")).toBe("missing.key");
  });

  it("throws on unsupported language", () => {
    // @ts-expect-error idioma inválido proposital
    expect(() => setLanguage("fr")).toThrow();
  });

  it("error messages follow the current language", () => {
    expect(() => randomInt(5, 1)).toThrow(/não pode ser maior/);
    setLanguage("en");
    expect(() => randomInt(5, 1)).toThrow(/cannot be greater/);
  });
});
