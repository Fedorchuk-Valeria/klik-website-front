export const HEADER_ANCHOR_OFFSET_PX = 120;
/** Cross-page navigation to home + scroll target (avoids `/#` fighting the App Router). */
export const PENDING_HOME_ANCHOR_KEY = "klick_pending_home_anchor";
/** Fired after scrolling to a home section (+ detail: { id: string }). */
export const SET_ACTIVE_ANCHOR_EVENT = "klick:set-active-anchor";

export const PLACE_STORAGE_KEY = "place";
export const COOKIE_CONSENT_STORAGE_KEY = "cookie_policy_accepted";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const TOKEN_KEY = "token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export const QUERY_PARAMS = {
  PHONE: "phone",
  IS_RESET_PASSWORD: "is_reset_password",
};

export const PAGES = {
  HOME: "/",
  NOT_FOUND: "/404",

  LOGIN: "/login",
  SIGN_UP: "/sign-up",
  CONFIRM_CODE: "/confirm-code",
  FORGOT_PASSWORD: "/reset-password",
  SET_NEW_PASSWORD: "/set-new-password",

  PERSONAL_ACCOUNT: "/personal-account",
  COURSES: "/courses",
  COURSE: "/course/:id",
};

export const PAGE_ANCHORS = {
  SELECT_TRAINING: "select-training",
  ABOUT: "about",
  PROGRAMS: "programs",
  FORMATS: "formats",
  FAQ: "faq",
  LOCATION: "location",
  REVIEWS: "reviews",
  WHAT: "what",
  TUTORS: "tutors",
  SIGN_UP_FREE_LESSON: "sign-up-free-lesson",
} as const;

export const CITY_DISPLAY_NAME = {
  minsk: "Минск",
  borisov: "Борисов",
  baranovichi: "Барановичи",
  novopolotsk: "Новополоцк",
};

export const MAP_API_KEY = process.env.NEXT_PUBLIC_YANDEX_API_KEY;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

export const PASSWORD_INPUT_STRIP_REGEX = /[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g;
