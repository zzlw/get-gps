"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center gap-4 px-4">
      <h1 className="font-semibold text-xl">{t("title")}</h1>
      <p className="text-muted-foreground text-sm">{t("description")}</p>
      <Button className="min-h-11 w-fit" onClick={reset}>
        {t("retry")}
      </Button>
    </main>
  );
}
