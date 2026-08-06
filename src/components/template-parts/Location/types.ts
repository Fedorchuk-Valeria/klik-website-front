import { UsersLocationResult } from "@/src/services/http/users";

export type LocationProps = {
  tag?: string;
  title?: string;
  city?: string;
  city_name?: string;
  city_map_url?: string;
  online_registration_url?: string;
  results?: UsersLocationResult[];
};

export type YandexMapView = {
  center: readonly [number, number];
  zoom: number;
};

export type YMapInstance = {
  destroy: () => void;
  setCenter: (center: number[], zoom?: number, options?: { duration?: number }) => void;
  getZoom: () => number;
  setZoom: (zoom: number, options?: { duration?: number }) => void;
  container?: {
    fitToViewport?: () => void;
  };
  geoObjects: {
    add: (object: unknown) => void;
    getBounds: () => number[][] | null;
  };
};
