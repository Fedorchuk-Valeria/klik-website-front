import type { YandexMapView } from "./types";

const YANDEX_MAPS_HOST_PATTERN = /(^|\.)yandex\.(ru|by|com|kz|uz|com\.tr)$/i;
const YANDEX_OBJECT_PATH_PATTERN = /\/(house|org|geo|biz)(\/|$)/i;
const LON_LAT_PAIR_PATTERN = /^(-?\d+(?:\.\d+)?)[, ](-?\d+(?:\.\d+)?)/;
const GOOGLE_COORDS_PATTERN = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;
/** Zoom is unused for pin coords; keep a sane cap for `parseYandexMapUrl`. */
const COORDS_PARSE_MAX_ZOOM = 21;

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

function isYandexObjectPageUrl(url: string): boolean {
  try {
    return isYandexMapsUrl(url) && YANDEX_OBJECT_PATH_PATTERN.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

export function parseYandexMapUrl(url: string, maxZoom: number): YandexMapView | null {
  if (!isYandexMapsUrl(url)) {
    return null;
  }

  const center = parseLonLatValue(getSearchParam(url, "ll"));
  if (!center) {
    return null;
  }

  const zRaw = getSearchParam(url, "z");
  const zoom = zRaw ? Math.round(Number(zRaw)) : 11;
  if (!Number.isFinite(zoom)) {
    return null;
  }

  return {
    center,
    zoom: Math.min(Math.max(zoom, 1), maxZoom),
  };
}

export function parseCoordsFromMapUrl(url: string): readonly [number, number] | undefined {
  return (
    parseGoogleCoords(url) ??
    parseExplicitPinCoords(url) ??
    parseYandexMapUrl(url, COORDS_PARSE_MAX_ZOOM)?.center
  );
}

export type MapGeocodeFn = (query: string) => Promise<readonly [number, number] | undefined>;

export async function resolveLocationCoords(input: {
  url: string;
  address?: string;
  city?: string;
  geocode?: MapGeocodeFn;
}): Promise<readonly [number, number] | undefined> {
  const explicit = parseGoogleCoords(input.url) ?? parseExplicitPinCoords(input.url);
  if (explicit) {
    return explicit;
  }

  if (isYandexObjectPageUrl(input.url) && input.geocode && input.address) {
    const query = [input.city, input.address].filter(Boolean).join(", ");
    const geocoded = await input.geocode(query);
    if (geocoded) {
      return geocoded;
    }
  }

  return parseCoordsFromMapUrl(input.url);
}
