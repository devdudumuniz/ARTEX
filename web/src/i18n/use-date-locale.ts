"use client";

import { enUS } from "date-fns/locale/en-US";
import { ptBR } from "date-fns/locale/pt-BR";
import { zhCN } from "date-fns/locale/zh-CN";
import { useTranslation } from "react-i18next";

import { resolveLocale } from "./config";

export function useDateLocale() {
  const { i18n } = useTranslation();
  const locale = resolveLocale(i18n.resolvedLanguage);
  return {
    locale,
    dateLocale: locale === "pt-BR" ? ptBR : locale === "en" ? enUS : zhCN,
    datePattern: locale === "pt-BR" ? "dd/MM/yyyy" : locale === "en" ? "MMM d, yyyy" : "yyyy年M月d日",
  };
}
