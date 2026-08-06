import { LOCATION_MAP_MAX_ZOOM } from ".";
import type { YandexMapView } from "./types";

const YANDEX_MAPS_HOST_PATTERN = /(^|\.)yandex\.(ru|by|com|kz|uz|com\.tr)$/i;
const YANDEX_MAP_LL_PATTERN = /[?&]ll=(-?\d+(?:\.\d+)?)(?:%2C|,)(-?\d+(?:\.\d+)?)/i;
const YANDEX_MAP_ZOOM_PATTERN = /[?&]z=(-?\d+(?:\.\d+)?)/;

function isYandexMapsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return YANDEX_MAPS_HOST_PATTERN.test(parsed.hostname) && parsed.pathname.includes("/maps");
  } catch {
    return false;
  }
}

export function parseYandexMapUrl(url: string, maxZoom: number): YandexMapView | null {
  if (!isYandexMapsUrl(url)) {
    return null;
  }

  const llMatch = url.match(YANDEX_MAP_LL_PATTERN);
  if (!llMatch) {
    return null;
  }

  const lon = Number(llMatch[1]);
  const lat = Number(llMatch[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  const zMatch = url.match(YANDEX_MAP_ZOOM_PATTERN);
  const zoom = zMatch ? Math.round(Number(zMatch[1])) : 11;
  if (!Number.isFinite(zoom)) {
    return null;
  }

  return {
    center: [lat, lon],
    zoom: Math.min(Math.max(zoom, 1), maxZoom),
  };
}

export function parseCoordsFromMapUrl(url: string): readonly [number, number] | undefined {
  const googleMatch = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (googleMatch) {
    return [Number(googleMatch[1]), Number(googleMatch[2])];
  }

  const yandexView = parseYandexMapUrl(url, LOCATION_MAP_MAX_ZOOM);
  return yandexView?.center;
}
