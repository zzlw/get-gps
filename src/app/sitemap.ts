import type { MetadataRoute } from "next";
import { localeHtmlLang, localePathname } from "@/i18n/locales";
import { routing } from "@/i18n/routing";

const origin = "https://gps.jiawen.live";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      localeHtmlLang[locale],
      `${origin}${localePathname(locale)}`,
    ]),
  );

  return routing.locales.map((locale) => ({
    url: `${origin}${localePathname(locale)}`,
    alternates: { languages },
  }));
}
