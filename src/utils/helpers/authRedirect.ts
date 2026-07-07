import { AUTH_RETURN_TO_KEY } from "@/src/utils/constant";

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

export const consumeAuthReturnTo = (): string | null => {
  if (typeof window === "undefined") return null;

  const returnTo = getSafeReturnTo(window.localStorage.getItem(AUTH_RETURN_TO_KEY));

  window.localStorage.removeItem(AUTH_RETURN_TO_KEY);

  return returnTo;
};
