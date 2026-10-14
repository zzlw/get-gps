import { defineRouting } from "next-intl/routing";

/**
 * Total-speaker ranking (Ethnologue-style): English, Mandarin, Hindi,
 * Spanish, French, Modern Standard Arabic, plus Japanese.
 * `zh` is Simplified Chinese.
 * The unprefixed URL stays Chinese so the existing site address does not move.
 */
export const routing = defineRouting({
  locales: ["en", "zh", "hi", "es", "fr", "ar", "ja"],
  defaultLocale: "zh",
  localePrefix: "as-needed",
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365,
  },
});

export type Locale = (typeof routing.locales)[number];
