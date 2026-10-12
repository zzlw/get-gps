"use client";

import {
  Check,
  LoaderCircle,
  LocateFixed,
  MapPinOff,
  Satellite,
} from "lucide-react";
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
  GPS_FIX_TIMEOUT_MS,
  GPS_MAX_ACCURACY_METERS,
  type GpsFailure,
  NO_GPS_MESSAGE,
  readDeviceGpsCapability,
  watchGpsFix,
} from "@/lib/gps";

type PanelStatus = "checking" | "idle" | "locating" | GpsFailure | "success";

export function GpsPanel() {
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
        <p className="font-medium">当前位置</p>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {status === "checking" ? (
          <p className="text-muted-foreground">正在检查这台设备的定位能力…</p>
        ) : null}

        {status === "locating" ? (
          <div className="flex items-center gap-4">
            <div className="relative grid size-16 shrink-0 place-items-center">
              <span className="absolute inset-0 rounded-full border border-primary/40 motion-safe:animate-ping" />
              <span className="absolute inset-2 rounded-full border border-primary/60" />
              <LoaderCircle className="size-5 text-primary motion-safe:animate-spin" />
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              正在等待 GPS 定位。请留在本页，室外空旷处通常更快，最长约{" "}
              {GPS_FIX_TIMEOUT_MS / 1000} 秒。
            </p>
          </div>
        ) : null}

        {showNoGps ? (
          <Alert variant="destructive">
            <MapPinOff />
            <AlertTitle>{NO_GPS_MESSAGE}</AlertTitle>
            <AlertDescription>
              {status === "unsupported"
                ? "当前浏览器没有提供定位接口。"
                : `没有得到 ${GPS_MAX_ACCURACY_METERS} 米以内的 GPS 定位。`}
            </AlertDescription>
          </Alert>
        ) : null}

        {status === "denied" ? (
          <Alert variant="destructive">
            <MapPinOff />
            <AlertTitle>无法获取定位</AlertTitle>
            <AlertDescription>
              浏览器拒绝了位置权限。允许本站使用位置信息后，再重新获取。
            </AlertDescription>
          </Alert>
        ) : null}

        {status === "insecure" ? (
          <Alert variant="destructive">
            <MapPinOff />
            <AlertTitle>无法获取定位</AlertTitle>
            <AlertDescription>
              定位只能在 HTTPS 或本机 localhost
              下使用。请换用安全连接后再打开本页。
            </AlertDescription>
          </Alert>
        ) : null}

        {locked ? (
          <dl className="grid gap-3">
            <div className="rounded-xl bg-muted/80 px-4 py-3">
              <dt className="text-muted-foreground text-xs">纬度</dt>
              <dd className="font-mono text-[clamp(1.5rem,4vw,2rem)] tabular-nums leading-tight">
                {formatLatitude(latitude)}
              </dd>
            </div>
            <div className="rounded-xl bg-muted/80 px-4 py-3">
              <dt className="text-muted-foreground text-xs">经度</dt>
              <dd className="font-mono text-[clamp(1.5rem,4vw,2rem)] tabular-nums leading-tight">
                {formatLongitude(longitude)}
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">精度</dt>
                <dd className="font-medium tabular-nums">
                  {Math.round(accuracy ?? 0)} 米
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">海拔</dt>
                <dd className="font-medium tabular-nums">
                  {altitude === null || altitude === undefined
                    ? "—"
                    : `${Math.round(altitude)} 米`}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground text-xs">北京时间</dt>
                <dd>{formatFixTime(position.timestamp)}</dd>
              </div>
            </div>
          </dl>
        ) : null}

        {status === "idle" ? (
          <p className="flex items-start gap-2 text-muted-foreground text-sm leading-6">
            <Satellite className="mt-0.5 size-4 shrink-0 text-primary" />
            准备读取。没有 GPS 的电脑通常给不出 {GPS_MAX_ACCURACY_METERS}{" "}
            米以内的精度。
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
            ? "重新获取"
            : "获取经纬度"}
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
            {copied ? "已复制" : "复制坐标"}
          </Button>
        ) : null}
        {copyError ? (
          <p className="text-destructive text-xs">
            复制失败，请长按坐标手动复制。
          </p>
        ) : null}
        <p className="sr-only" aria-live="polite">
          {copied ? "坐标已复制" : ""}
          {copyError ? "复制失败" : ""}
          {showNoGps ? NO_GPS_MESSAGE : ""}
        </p>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: PanelStatus }) {
  if (status === "success") {
    return <Badge className="bg-accent text-accent-foreground">已锁定</Badge>;
  }
  if (status === "locating" || status === "checking") {
    return <Badge variant="secondary">搜寻中</Badge>;
  }
  if (status === "idle") {
    return <Badge variant="outline">待命</Badge>;
  }
  return <Badge variant="destructive">未获取</Badge>;
}
