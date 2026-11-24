import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./config";
import { resources } from "./messages";

export function createAppI18n() {
  const instance = createInstance();
  void instance.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LOCALE,
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LOCALES],
    load: "currentOnly",
    initAsync: false,
    keySeparator: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  // In CLDR / Intl.PluralRules("pt-BR"), count === 0 resolves to "one", which would
  // produce "0 tarefa" instead of natural Brazilian Portuguese "0 tarefas".
  const pluralResolver = instance.services?.pluralResolver;
  if (pluralResolver && typeof pluralResolver.getSuffix === "function") {
    const origGetSuffix = pluralResolver.getSuffix.bind(pluralResolver);
    pluralResolver.getSuffix = (code: string, count: number, options?: Record<string, unknown>) => {
      if (/^pt(?:-|$)/i.test(code) && count === 0 && !options?.ordinal) {
        return "_other";
      }
      return origGetSuffix(code, count, options);
    };
  }

  return instance;
}
