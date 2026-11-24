export const DEFAULT_LOCALE = "pt-BR";
export const SUPPORTED_LOCALES = ["pt-BR", "en", "zh-CN"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const LOCALE_STORAGE_KEY = "artex_locale";

export function resolveLocale(value: string | null | undefined): AppLocale {
  const normalized = (value ?? "").trim();
  if (/^en(?:-|$)/i.test(normalized)) return "en";
  if (/^zh(?:-|$)/i.test(normalized)) return "zh-CN";
  if (/^pt(?:-|$)/i.test(normalized)) return "pt-BR";
  return DEFAULT_LOCALE;
}
