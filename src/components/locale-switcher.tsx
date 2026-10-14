"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isLocale, localeNames } from "@/i18n/locales";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const items = routing.locales.map((code) => ({
  value: code,
  label: localeNames[code],
}));

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");

  return (
    <Select
      items={items}
      value={locale}
      onValueChange={(next) => {
        if (!next || !isLocale(next) || next === locale) {
          return;
        }
        router.replace(pathname, { locale: next });
      }}
    >
      <SelectTrigger
        aria-label={t("label")}
        className="h-8 gap-1 bg-background px-2.5 text-xs hover:bg-muted [&_svg]:size-3.5"
      >
        <SelectValue className="flex-none text-start" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="end">
        {items.map((item) => (
          <SelectItem
            key={item.value}
            value={item.value}
            lang={item.value}
            className="cursor-pointer"
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
