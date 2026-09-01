import type { YandexMapView } from "./types";

const YANDEX_MAPS_HOST_PATTERN = /(^|\.)yandex\.(ru|by|com|kz|uz|com\.tr)$/i;
const LON_LAT_PAIR_PATTERN = /^(-?\d+(?:\.\d+)?)[, ](-?\d+(?:\.\d+)?)/;
const GOOGLE_COORDS_PATTERN = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;
const GOOGLE_ZOOM_PATTERN = /@-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?,(\d+(?:\.\d+)?)z/;
const COORDS_PARSE_MAX_ZOOM = 21;
const ZOOM_MIN = 1;
const LOCATION_PIN_DEFAULT_ZOOM = 16;

function isYandexMapsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return YANDEX_MAPS_HOST_PATTERN.test(parsed.hostname) && parsed.pathname.includes("/maps");
  } catch {
    return false;
  }
}

function getSearchParam(url: string, name: string): string | null {
  try {
    return new URL(url).searchParams.get(name);
  } catch {
    return null;
  }
}

function clampZoom(zoom: number, maxZoom = COORDS_PARSE_MAX_ZOOM): number {
  return Math.min(Math.max(zoom, ZOOM_MIN), maxZoom);
}

function parseNumericZoom(value: string | null | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const zoom = Math.round(Number(value));
  if (!Number.isFinite(zoom)) {
    return undefined;
  }

  return clampZoom(zoom);
}

function parseLonLatValue(value: string | null | undefined): readonly [number, number] | undefined {
  if (!value) {
    return undefined;
  }

  const match = value.trim().match(LON_LAT_PAIR_PATTERN);
  if (!match) {
    return undefined;
  }

  const lon = Number(match[1]);
  const lat = Number(match[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return undefined;
  }

  return [lat, lon];
}

function parseGoogleCoords(url: string): readonly [number, number] | undefined {
  const googleMatch = url.match(GOOGLE_COORDS_PATTERN);
  if (!googleMatch) {
    return undefined;
  }

  const lat = Number(googleMatch[1]);
  const lon = Number(googleMatch[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return undefined;
  }

  return [lat, lon];
}

function parseExplicitPinCoords(url: string): readonly [number, number] | undefined {
  if (!isYandexMapsUrl(url)) {
    return undefined;
  }

  return (
    parseLonLatValue(getSearchParam(url, "pt")) ??
    parseLonLatValue(getSearchParam(url, "whatshere[point]"))
  );
}

export function parseYandexMapUrl(url: string, maxZoom: number): YandexMapView | null {
  if (!isYandexMapsUrl(url)) {
    return null;
  }

  const center = parseLonLatValue(getSearchParam(url, "ll"));
  if (!center) {
    return null;
  }

  const zoom = parseNumericZoom(getSearchParam(url, "z")) ?? 11;

  return {
    center,
    zoom: clampZoom(zoom, maxZoom),
  };
}

export function parseZoomFromMapUrl(
  url: string,
  fallback = LOCATION_PIN_DEFAULT_ZOOM
): number {
  const googleZoom = url.match(GOOGLE_ZOOM_PATTERN)?.[1];

  return (
    parseNumericZoom(getSearchParam(url, "z")) ??
    parseNumericZoom(getSearchParam(url, "whatshere[zoom]")) ??
    parseNumericZoom(googleZoom) ??
    fallback
  );
}

export function parseCoordsFromMapUrl(url: string): readonly [number, number] | undefined {
  return (
    parseGoogleCoords(url) ??
    parseExplicitPinCoords(url) ??
    parseYandexMapUrl(url, COORDS_PARSE_MAX_ZOOM)?.center
  );
}
