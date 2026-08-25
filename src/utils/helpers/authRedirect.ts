import { AUTH_RETURN_TO_KEY, PAGES, QUERY_PARAMS } from "@/src/utils/constant";

export const getSafeReturnTo = (value: string | null | undefined): string | null => {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
};

export const saveAuthReturnTo = (returnTo: string): void => {
  if (typeof window === "undefined") return;

  const safeReturnTo = getSafeReturnTo(returnTo);

  if (safeReturnTo) {
    window.localStorage.setItem(AUTH_RETURN_TO_KEY, safeReturnTo);
  }
};

export const getAuthReturnTo = (): string | null => {
  if (typeof window === "undefined") return null;

  return getSafeReturnTo(window.localStorage.getItem(AUTH_RETURN_TO_KEY));
};

export const consumeAuthReturnTo = (): string | null => {
  if (typeof window === "undefined") return null;

  const returnTo = getAuthReturnTo();

  if (returnTo) {
    window.localStorage.removeItem(AUTH_RETURN_TO_KEY);
  }

  return returnTo;
};

export const buildLoginUrl = (returnTo: string): string => {
  const safeReturnTo = getSafeReturnTo(returnTo);

  if (!safeReturnTo) {
    return PAGES.LOGIN;
  }

  return `${PAGES.LOGIN}?${QUERY_PARAMS.RETURN_TO}=${encodeURIComponent(safeReturnTo)}`;
};

export const withReturnToQuery = (path: string, returnTo?: string | null): string => {
  const safeReturnTo = getSafeReturnTo(returnTo ?? getAuthReturnTo());

  if (!safeReturnTo) {
    return path;
  }

  return `${path}?${QUERY_PARAMS.RETURN_TO}=${encodeURIComponent(safeReturnTo)}`;
};

export const persistReturnToFromQuery = (): void => {
  if (typeof window === "undefined") return;

  const returnTo = getSafeReturnTo(
    new URLSearchParams(window.location.search).get(QUERY_PARAMS.RETURN_TO)
  );

  if (returnTo) {
    saveAuthReturnTo(returnTo);
  }
};
