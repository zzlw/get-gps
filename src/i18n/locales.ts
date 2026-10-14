import { type Locale, routing } from "@/i18n/routing";

/** Endonyms, so the switcher stays readable before the UI language changes. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
  ar: "العربية",
  ja: "日本語",
};

/** BCP 47 tags for `lang`. The URL segment stays the shorter routing code. */
export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  zh: "zh-Hans",
  hi: "hi",
  es: "es",
  fr: "fr",
  ar: "ar",
  ja: "ja",
};

export function isLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale);
}

export function localeDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Matches `localePrefix: "as-needed"` in the routing config. */
export function localePathname(locale: Locale): string {
  return locale === routing.defaultLocale ? "/" : `/${locale}`;
}
