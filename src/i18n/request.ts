import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { type Locale, routing } from "@/i18n/routing";
import type enMessages from "../../messages/en.json";

const messageLoaders = {
  en: () => import("../../messages/en.json"),
  zh: () => import("../../messages/zh.json"),
  hi: () => import("../../messages/hi.json"),
  es: () => import("../../messages/es.json"),
  fr: () => import("../../messages/fr.json"),
  ar: () => import("../../messages/ar.json"),
  ja: () => import("../../messages/ja.json"),
} as const;

export default getRequestConfig(async ({ locale }) => {
  let active: Locale;
  if (locale && hasLocale(routing.locales, locale)) {
    active = locale;
  } else {
    const paramValue = await rootParams.locale();
    if (!hasLocale(routing.locales, paramValue)) {
      notFound();
    }
    active = paramValue;
  }

  return {
    locale: active,
    messages: (await messageLoaders[active]()).default as typeof enMessages,
  };
});
