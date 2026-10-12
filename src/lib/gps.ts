/** Civilian GNSS fixes are typically well inside this radius. The Geolocation API does not name its source. */
export const GPS_MAX_ACCURACY_METERS = 50;

export const GPS_FIX_TIMEOUT_MS = 30_000;

export const NO_GPS_MESSAGE = "无法获取，当前设备不存在 GPS 功能";

export type GpsFailure = "unsupported" | "insecure" | "denied" | "no-gps";

export function isGpsAccuracy(accuracy: number): boolean {
  return (
    Number.isFinite(accuracy) &&
    accuracy > 0 &&
    accuracy <= GPS_MAX_ACCURACY_METERS
  );
}

export function readDeviceGpsCapability(): GpsFailure | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!window.isSecureContext) {
    return "insecure";
  }
  if (!("geolocation" in navigator)) {
    return "unsupported";
  }
  return null;
}

export function watchGpsFix(
  onFix: (position: GeolocationPosition) => void,
  onFailure: (failure: Exclude<GpsFailure, "unsupported" | "insecure">) => void,
): () => void {
  let settled = false;
  let watchId = 0;
  let timer = 0;

  const stop = () => {
    settled = true;
    if (watchId !== 0) {
      navigator.geolocation.clearWatch(watchId);
    }
    window.clearTimeout(timer);
  };

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      if (settled || !isGpsAccuracy(position.coords.accuracy)) {
        return;
      }
      stop();
      onFix(position);
    },
    (error) => {
      if (settled) {
        return;
      }
      stop();
      onFailure(error.code === error.PERMISSION_DENIED ? "denied" : "no-gps");
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: GPS_FIX_TIMEOUT_MS,
    },
  );

  if (settled) {
    navigator.geolocation.clearWatch(watchId);
    return () => {};
  }

  timer = window.setTimeout(() => {
    if (settled) {
      return;
    }
    stop();
    onFailure("no-gps");
  }, GPS_FIX_TIMEOUT_MS);

  return stop;
}

export function formatCoordinate(value: number): string {
  return value.toFixed(6);
}

export function formatLatitude(value: number): string {
  const hemisphere = value >= 0 ? "N" : "S";
  return `${Math.abs(value).toFixed(6)}° ${hemisphere}`;
}

export function formatLongitude(value: number): string {
  const hemisphere = value >= 0 ? "E" : "W";
  return `${Math.abs(value).toFixed(6)}° ${hemisphere}`;
}

export function formatFixTime(timestamp: number): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(timestamp);
}
