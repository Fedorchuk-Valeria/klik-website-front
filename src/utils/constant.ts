export const PLACE_STORAGE_KEY = "place";
export const COOKIE_CONSENT_STORAGE_KEY = "cookie_policy_accepted";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const PAGE_ANCHORS = {
  ABOUT: "about",
  PROGRAMS: "programs",
  FORMATS: "formats",
  FAQ: "faq",
  LOCATION: "location",
  REVIEWS: "reviews",
} as const;

export const CITY_DISPLAY_NAME = {
  minsk: "Минск",
  borisov: "Борисов",
  baranovichi: "Барановичи",
  novopolotsk: "Новополоцк",
};

export const MAP_API_KEY = process.env.NEXT_PUBLIC_YANDEX_API_KEY;
