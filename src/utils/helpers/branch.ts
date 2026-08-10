// Resolves CRM branch_id for registration from the last visited page and current hostname.
import { AUTH_REFERRER_KEY, BRANCH_CRM_ID } from "@/src/utils/constant";
import { ROOT_DOMAIN } from "@/src/lib/env";

import CookieHelper from "./cookie";

const SUBDOMAIN_BRANCH_MAP: Record<string, string> = {
  baranovichi: "2",
  borisov: "3",
  novopolotsk: "4",
};

export const MINSK_BRANCH_ID = "1";
export const PLATFORM_BRANCH_ID = "5";

const AUTH_PATH_PREFIXES = [
  "/login",
  "/sign-up",
  "/confirm-code",
  "/reset-password",
  "/set-new-password",
];

export const isAuthPath = (pathname: string): boolean =>
  AUTH_PATH_PREFIXES.some(
    (authPath) => pathname === authPath || pathname.startsWith(`${authPath}/`)
  );

export const isLandingPath = (pathname: string): boolean => {
  const path = pathname.split("?")[0].split("#")[0];

  if (path === "/" || path === "") {
    return true;
  }

  return path.startsWith("/program/") || path.startsWith("/programs/");
};

export const getBranchIdFromHostname = (hostname?: string): string => {
  const host = (hostname ?? (typeof window !== "undefined" ? window.location.hostname : "")).split(
    ":"
  )[0];
  const rootDomain = ROOT_DOMAIN.split(":")[0];

  if (!host || !rootDomain) {
    return PLATFORM_BRANCH_ID;
  }

  if (host === rootDomain || host === `www.${rootDomain}`) {
    return MINSK_BRANCH_ID;
  }

  if (host.endsWith(`.${rootDomain}`)) {
    const subdomain = host.slice(0, -(rootDomain.length + 1));

    return SUBDOMAIN_BRANCH_MAP[subdomain] ?? PLATFORM_BRANCH_ID;
  }

  return PLATFORM_BRANCH_ID;
};

// Landing home or program page — branch is derived from the domain; anything else → platform (5).
export const resolveRegistrationBranchId = (referrerPath: string | null | undefined): string => {
  if (!referrerPath || !isLandingPath(referrerPath)) {
    return PLATFORM_BRANCH_ID;
  }

  return getBranchIdFromHostname();
};

export const saveAuthReferrer = (referrerPath: string): void => {
  if (typeof window === "undefined" || !referrerPath.startsWith("/") || referrerPath.startsWith("//")) {
    return;
  }

  window.sessionStorage.setItem(AUTH_REFERRER_KEY, referrerPath);
};

export const getAuthReferrer = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(AUTH_REFERRER_KEY);
};

// Writes branch_id cookie on login/sign-up so register API receives the correct CRM branch.
export const syncRegistrationBranchCookie = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  const branchId = resolveRegistrationBranchId(getAuthReferrer());

  CookieHelper.setCookie(BRANCH_CRM_ID, branchId);
};
