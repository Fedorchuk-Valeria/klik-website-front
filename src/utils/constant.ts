export const HEADER_ANCHOR_OFFSET_PX = 120;
/** Cross-page navigation to home + scroll target (avoids `/#` fighting the App Router). */
export const PENDING_HOME_ANCHOR_KEY = "klick_pending_home_anchor";
/** Fired after scrolling to a home section (+ detail: { id: string }). */
export const SET_ACTIVE_ANCHOR_EVENT = "klick:set-active-anchor";

export const AUTH_RETURN_TO_KEY = "return_to";
export const AUTH_REFERRER_KEY = "auth_referrer";

export const PLACE_STORAGE_KEY = "place";
export const COOKIE_CONSENT_STORAGE_KEY = "cookie_policy_accepted";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const TOKEN_KEY = "token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER = "user_data";
export const BRANCH_CRM_ID = "branch_id";
export const COURSES_PAGE_SIZE = 12;

export const PENDING_ADMIN_REVIEW_STATUS = "pending_admin_review";

export const QUERY_PARAMS = {
  PAGE: "page",
  PAGE_SIZE: "page_size",

  PHONE: "phone",
  IS_RESET_PASSWORD: "is_reset_password",

  FILTER: "filter",
  SCOPE: "scope",
  CATEGORIES: "categories",

  CHILD_ID: "child_id",
  IS_PARENT: "is_parent",
  RETURN_TO: "return_to",
};

export const PAGES = {
  HOME: "/",
  NOT_FOUND: "/404",

  LOGIN: "/login",
  SIGN_UP: "/sign-up",
  CONFIRM_CODE: "/confirm-code",
  FORGOT_PASSWORD: "/reset-password",
  SET_NEW_PASSWORD: "/set-new-password",

  PROFILE: "/profile",
  PROFILE_PASSWORD: "/profile/password",
  PROFILE_PAYMENTS: "/profile/payments",

  COURSES: "/courses",
  COURSE: "/courses/:id",
  LESSON: "/courses/:id/lesson/:lessonId",
  TEST: "/courses/:id/test/:lessonId/:userId",

  PROFILE_CHILDREN_DETAILS: "/profile/children/:id",
  PROFILE_CHILDREN_PASSWORD: "/profile/children/:id/password",

  CONTACTS_PAGE: "/contacts",
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

  COURSES: "courses",
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

export const PUBLIC_OFFER_SOURCE_URL =
  "https://storage.yandexcloud.net/klikcloud/%D0%9F%D1%83%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D1%8B%D0%B8%CC%86%20%D0%B4%D0%BE%D0%B3%D0%BE%D0%B2%D0%BE%D1%80%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0_15.05.26.pdf";

export const PUBLIC_OFFER_URL = "/public-offer";

export const PAYMENT_INFORMATION_SOURCE_URL =
  "https://storage.yandexcloud.net/klikcloud/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BE%20%D1%81%D0%BF%D0%BE%D1%81%D0%BE%D0%B1%D0%B0%D1%85%20%D0%BE%D0%BF%D0%BB%D0%B0%D1%82%D1%8B%20%D0%BF%D1%80%D0%B8%20%D0%B8%D0%BD%D1%82%D0%B5%D0%B3%D1%80%D0%B0%D1%86%D0%B8%D0%B8.docx.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YCAJE7vSS1qMNjwKi6cAjzNHq%2F20260625%2Fru-central1%2Fs3%2Faws4_request&X-Amz-Date=20260625T122023Z&X-Amz-Expires=2592000&X-Amz-Signature=e8f68a4c30b0ad46c76f696f6b8537a996564e4637e642077e90b0a26f87613a&X-Amz-SignedHeaders=host&response-content-disposition=attachment";

export const PAYMENT_INFORMATION_URL = "/payment-information";

export const VALIDATION_CLASS = "validatio-error";

export const PAYMENT_STATUS_SUCCESSFULL = "paid";
export const PAYMENT_STATUS_FAILED = "failed";

export const METRICS = {
  klikcoins: {
    icon: "clicoins",
    title: "Кликоины",
    plural: ["кликоин", "кликоина", "кликоинов"] as string[],
    info: `Кликоины — это бонусные баллы, которые ученик получает за каждое оффлайн-занятие. Накопленные кликоины можно обменять на призы и подарки в специальном «Кликмаркете». Маркет проводится два раза в год — следите за объявлениями!`,
  },
  balance: {
    icon: "money",
    title: "Баланс",
    plural: ["белорусский рубль", "белорусских рубля", "белорусских рублей"] as string[],
    info: "Это ваш предоплаченный баланс. Вы вносите деньги за несколько занятий вперёд, и система автоматически списывает стоимость одного урока после его проведения. Так вы можете не думать о ежемесячной оплате - просто пополняйте счёт, и занятия будут оплачиваться сами.",
  },
  homework: {
    icon: "homework",
    title: "Занятия",
    plural: ["оплаченное занятие", "оплаченных занятия", "оплаченных занятий"] as string[],
  },
} as const;
