/** ~95% radius from the Geolocation API, which does not name its source. Settled phone GNSS is usually inside this; wider readings are treated as network estimates. */
export const GPS_MAX_ACCURACY_METERS = 20;

/** Reuse a satellite fix acquired within this window instead of forcing a cold solution. */
export const GPS_MAX_AGE_MS = 15_000;

export const GPS_FIX_TIMEOUT_MS = 20_000;

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
  let watchId: number | null = null;
  let deadlineTimer = 0;
  let currentUnavailable = false;
  let watchUnavailable = false;

  const stop = () => {
    settled = true;
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    window.clearTimeout(deadlineTimer);
  };

  const fail = (failure: Exclude<GpsFailure, "unsupported" | "insecure">) => {
    if (settled) {
      return;
    }
    stop();
    onFailure(failure);
  };

  const onPosition = (position: GeolocationPosition) => {
    if (settled) {
      return;
    }
    const { accuracy } = position.coords;
    if (Date.now() - position.timestamp > GPS_MAX_AGE_MS) {
      return;
    }
    if (!isGpsAccuracy(accuracy)) {
      return;
    }
    stop();
    onFix(position);
  };

  const failIfBothUnavailable = () => {
    if (currentUnavailable && watchUnavailable) {
      fail("no-gps");
    }
  };

  const onWatchError = (error: GeolocationPositionError) => {
    if (error.code === error.PERMISSION_DENIED) {
      fail("denied");
      return;
    }
    if (error.code === error.POSITION_UNAVAILABLE) {
      watchUnavailable = true;
      failIfBothUnavailable();
    }
  };

  const onCurrentError = (error: GeolocationPositionError) => {
    if (error.code === error.PERMISSION_DENIED) {
      fail("denied");
      return;
    }
    if (error.code === error.POSITION_UNAVAILABLE) {
      currentUnavailable = true;
      failIfBothUnavailable();
    }
  };

  const options: PositionOptions = {
    enableHighAccuracy: true,
    maximumAge: GPS_MAX_AGE_MS,
    timeout: GPS_FIX_TIMEOUT_MS,
  };

  watchId = navigator.geolocation.watchPosition(
    onPosition,
    onWatchError,
    options,
  );
  navigator.geolocation.getCurrentPosition(onPosition, onCurrentError, options);

  if (settled) {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    return () => {};
  }

  deadlineTimer = window.setTimeout(() => fail("no-gps"), GPS_FIX_TIMEOUT_MS);

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

export function formatMeters(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "meter",
    unitDisplay: "short",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatFixTime(timestamp: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(timestamp);
}
