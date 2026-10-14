"use client";

import {
  Check,
  LoaderCircle,
  LocateFixed,
  MapPinOff,
  Satellite,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  formatCoordinate,
  formatFixTime,
  formatLatitude,
  formatLongitude,
  formatMeters,
  GPS_MAX_ACCURACY_METERS,
  type GpsFailure,
  readDeviceGpsCapability,
  watchGpsFix,
} from "@/lib/gps";

type PanelStatus = "checking" | "idle" | "locating" | GpsFailure | "success";

export function GpsPanel() {
  const t = useTranslations("GpsPanel");
  const locale = useLocale();
  const [status, setStatus] = useState<PanelStatus>("checking");
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const capability = readDeviceGpsCapability();
    setStatus(capability ?? "idle");

    return () => {
      stopRef.current?.();
    };
  }, []);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function locate() {
    stopRef.current?.();
    setCopied(false);
    setCopyError(false);
    setPosition(null);
    setStatus("locating");

    stopRef.current = watchGpsFix(
      (next) => {
        stopRef.current = null;
        setPosition(next);
        setStatus("success");
      },
      (failure) => {
        stopRef.current = null;
        setPosition(null);
        setStatus(failure);
      },
    );
  }

  async function copyCoordinates() {
    if (!position) {
      return;
    }
    const { latitude, longitude } = position.coords;
    const text = `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  const blocked = status === "unsupported" || status === "insecure";
  const showNoGps = status === "unsupported" || status === "no-gps";
  const { latitude, longitude, accuracy, altitude } = position?.coords ?? {};
  const locked =
    status === "success" &&
    position &&
    latitude !== undefined &&
    longitude !== undefined;

  return (
    <Card
      data-slot="gps-panel"
      aria-busy={status === "locating" || status === "checking"}
      className="shadow-lg ring-foreground/15"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <p className="font-medium">{t("heading")}</p>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {status === "checking" ? (
          <p className="text-muted-foreground">{t("checking")}</p>
        ) : null}

        {status === "locating" ? (
          <div className="flex items-center gap-4">
            <div className="relative grid size-16 shrink-0 place-items-center">
              <span className="absolute inset-0 rounded-full border border-primary/40 motion-safe:animate-ping" />
              <span className="absolute inset-2 rounded-full border border-primary/60" />
              <LoaderCircle className="size-5 text-primary motion-safe:animate-spin" />
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              {t("locating")}
            </p>
          </div>
        ) : null}

        {showNoGps ? (
          <Alert variant="destructive">
            <MapPinOff />
            <AlertTitle>{t("noGps")}</AlertTitle>
            <AlertDescription>
              {status === "unsupported"
                ? t("unsupported")
                : t("inaccurate", { meters: GPS_MAX_ACCURACY_METERS })}
            </AlertDescription>
          </Alert>
        ) : null}

        {status === "denied" ? (
          <Alert variant="destructive">
            <MapPinOff />
            <AlertTitle>{t("unavailableTitle")}</AlertTitle>
            <AlertDescription>{t("denied")}</AlertDescription>
          </Alert>
        ) : null}

        {status === "insecure" ? (
          <Alert variant="destructive">
            <MapPinOff />
            <AlertTitle>{t("unavailableTitle")}</AlertTitle>
            <AlertDescription>{t("insecure")}</AlertDescription>
          </Alert>
        ) : null}

        {locked ? (
          <dl className="grid gap-3">
            <div className="rounded-xl bg-muted/80 px-4 py-3">
              <dt className="text-muted-foreground text-xs">{t("latitude")}</dt>
              <dd
                dir="ltr"
                className="font-mono text-[clamp(1.5rem,4vw,2rem)] tabular-nums leading-tight"
              >
                {formatLatitude(latitude)}
              </dd>
            </div>
            <div className="rounded-xl bg-muted/80 px-4 py-3">
              <dt className="text-muted-foreground text-xs">
                {t("longitude")}
              </dt>
              <dd
                dir="ltr"
                className="font-mono text-[clamp(1.5rem,4vw,2rem)] tabular-nums leading-tight"
              >
                {formatLongitude(longitude)}
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">
                  {t("accuracy")}
                </dt>
                <dd className="font-medium tabular-nums">
                  {formatMeters(Math.round(accuracy ?? 0), locale)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">
                  {t("altitude")}
                </dt>
                <dd className="font-medium tabular-nums">
                  {altitude === null || altitude === undefined
                    ? "—"
                    : formatMeters(Math.round(altitude), locale)}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground text-xs">
                  {t("fixTime")}
                </dt>
                <dd>{formatFixTime(position.timestamp, locale)}</dd>
              </div>
            </div>
          </dl>
        ) : null}

        {status === "idle" ? (
          <p className="flex items-start gap-2 text-muted-foreground text-sm leading-6">
            <Satellite className="mt-0.5 size-4 shrink-0 text-primary" />
            {t("idle", { meters: GPS_MAX_ACCURACY_METERS })}
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 sm:flex-row">
        <Button
          size="lg"
          className="min-h-11 sm:min-w-36"
          disabled={blocked || status === "checking" || status === "locating"}
          onClick={locate}
        >
          <LocateFixed data-icon="inline-start" />
          {status === "success" || status === "no-gps" || status === "denied"
            ? t("retry")
            : t("locate")}
        </Button>
        {locked ? (
          <Button
            size="lg"
            variant="outline"
            className="min-h-11"
            onClick={() => {
              void copyCoordinates();
            }}
          >
            {copied ? <Check data-icon="inline-start" /> : null}
            {copied ? t("copied") : t("copy")}
          </Button>
        ) : null}
        {copyError ? (
          <p className="text-destructive text-xs">{t("copyFailed")}</p>
        ) : null}
        <p className="sr-only" aria-live="polite">
          {copied ? t("copiedLive") : ""}
          {copyError ? t("copyFailedLive") : ""}
          {showNoGps ? t("noGps") : ""}
        </p>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: PanelStatus }) {
  const t = useTranslations("GpsPanel");
  if (status === "success") {
    return (
      <Badge className="bg-accent text-accent-foreground">
        {t("badgeLocked")}
      </Badge>
    );
  }
  if (status === "locating" || status === "checking") {
    return <Badge variant="secondary">{t("badgeSearching")}</Badge>;
  }
  if (status === "idle") {
    return <Badge variant="outline">{t("badgeIdle")}</Badge>;
  }
  return <Badge variant="destructive">{t("badgeMissing")}</Badge>;
}
