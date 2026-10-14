import { Compass } from "lucide-react";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GpsPanel } from "@/components/gps-panel";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { routing } from "@/i18n/routing";
import { GPS_MAX_ACCURACY_METERS } from "@/lib/gps";

const insetX =
  "pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        className="survey-grid pointer-events-none absolute inset-0"
        aria-hidden
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-20 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring"
      >
        {t("skip")}
      </a>
      <header className="sticky top-0 z-10 border-b bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
        <div
          className={`mx-auto flex min-h-14 w-full max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2 ${insetX}`}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <Compass className="size-4" aria-hidden />
            </span>
            <p className="truncate font-medium tracking-wide">{t("brand")}</p>
          </div>
          <div className="ms-auto flex items-center gap-3">
            <p className="text-muted-foreground text-xs">{t("privacy")}</p>
            <LocaleSwitcher />
          </div>
        </div>
      </header>
      <main
        id="main"
        className={`relative mx-auto grid w-full max-w-5xl flex-1 items-start gap-8 py-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-14 ${insetX}`}
      >
        <div className="flex flex-col gap-4 lg:pt-6">
          <p className="font-medium text-primary text-xs tracking-[0.18em]">
            {t("eyebrow")}
          </p>
          <h1 className="text-balance font-semibold text-[clamp(2rem,5vw,3.25rem)] leading-[1.1]">
            {t("title")}
          </h1>
          <p className="max-w-prose text-muted-foreground text-sm leading-7">
            {t("lead", { meters: GPS_MAX_ACCURACY_METERS })}
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {t("stepPermission")}
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-foreground" />
              {t("stepOutdoors")}
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
              {t("stepLocal")}
            </li>
          </ul>
        </div>
        <GpsPanel />
      </main>
      <footer className="relative mt-auto border-t bg-background/80">
        <p
          className={`mx-auto w-full max-w-5xl py-4 text-muted-foreground text-xs ${insetX}`}
        >
          {t("footer")}
        </p>
      </footer>
    </div>
  );
}
