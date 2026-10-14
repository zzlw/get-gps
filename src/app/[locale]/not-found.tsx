import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center gap-4 px-4">
      <h1 className="font-semibold text-xl">{t("title")}</h1>
      <p className="text-muted-foreground text-sm">{t("description")}</p>
      <Link
        href="/"
        className={cn(buttonVariants({ size: "lg" }), "min-h-11 w-fit")}
      >
        {t("home")}
      </Link>
    </main>
  );
}
