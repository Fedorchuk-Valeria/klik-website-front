import { ROOT_DOMAIN } from "@/src/lib/env";
import { COOKIE_CONSENT_STORAGE_KEY, PLACE_STORAGE_KEY } from "@/src/utils/constant";

/** ~30 days — shared prefs across subdomains via Domain=.root */
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

const LEGACY_COOKIE_CONSENT_VALUE = "true";
const PRODUCTION_ROOT_DOMAIN = "it-klik.by";

function hostnameFromEnv(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_APP_ROOT_DOMAIN?.trim();
  if (!raw) return undefined;
  return raw.split(":")[0] || undefined;
}

function appRootHostname(): string {
  return hostnameFromEnv() ?? ROOT_DOMAIN.split(":")[0];
}

/** Leading-dot domain for cross-subdomain cookies; omitted on localhost. */
export function getClientCookieDomain(): string | undefined {
  const host = hostnameFromEnv();
  if (!host) return undefined;
  if (host === "localhost" || host === "127.0.0.1") return undefined;
  const base = host.startsWith(".") ? host.slice(1) : host;
  return `.${base}`;
}

/** Parent domain whose cookies leak into prefixed env hosts (e.g. prod → test). */
function getConflictingParentCookieDomain(): string | undefined {
  const root = appRootHostname();
  const labels = root.split(".");

  if (labels.length <= 2) return undefined;

  const envPrefix = labels[0];
  if (envPrefix !== "test" && envPrefix !== "staging" && envPrefix !== "dev") {
    return undefined;
  }

  return `.${labels.slice(1).join(".")}`;
}

function getAllClientCookieValues(name: string): string[] {
  if (typeof document === "undefined") return [];

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?:^|; )${escaped}=([^;]*)`, "g");
  const values: string[] = [];

  for (const match of document.cookie.matchAll(re)) {
    values.push(decodeURIComponent(match[1]));
  }

  return values;
}

export function getClientCookie(name: string): string | undefined {
  return getAllClientCookieValues(name)[0];
}

export function deleteClientCookie(name: string, domain?: string): void {
  if (typeof document === "undefined") return;

  const segments = [`${encodeURIComponent(name)}=`, "Path=/", "Max-Age=0", "SameSite=Lax"];

  const resolvedDomain = domain ?? getClientCookieDomain();
  if (resolvedDomain) {
    segments.push(`Domain=${resolvedDomain}`);
  }

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    segments.push("Secure");
  }

  document.cookie = segments.join("; ");
}

export function setClientCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;

  const segments = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${MAX_AGE_SECONDS}`,
    "SameSite=Lax",
  ];

  const domain = getClientCookieDomain();
  if (domain) {
    segments.push(`Domain=${domain}`);
  }

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    segments.push("Secure");
  }

  document.cookie = segments.join("; ");
}

export function hasCookieConsentForEnvironment(): boolean {
  const values = getAllClientCookieValues(COOKIE_CONSENT_STORAGE_KEY);
  if (values.length === 0) return false;

  const currentRoot = appRootHostname();
  if (values.includes(currentRoot)) return true;

  // Legacy prod-only consent before values were scoped by environment root.
  return currentRoot === PRODUCTION_ROOT_DOMAIN && values.includes(LEGACY_COOKIE_CONSENT_VALUE);
}

export function setCookieConsentForEnvironment(): void {
  setClientCookie(COOKIE_CONSENT_STORAGE_KEY, appRootHostname());
}

export function getPlaceCookie(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const values = getAllClientCookieValues(PLACE_STORAGE_KEY);
  if (values.length === 0) return undefined;

  const origin = window.location.origin;
  const currentRoot = appRootHostname();

  const exactMatch = values.find((value) => {
    try {
      return new URL(value).origin === origin;
    } catch {
      return false;
    }
  });
  if (exactMatch) return exactMatch;

  return values.find((value) => {
    try {
      const hostname = new URL(value).hostname;
      return hostname === currentRoot || hostname.endsWith(`.${currentRoot}`);
    } catch {
      return false;
    }
  });
}

export function setPlaceCookie(value: string): void {
  setClientCookie(PLACE_STORAGE_KEY, value);

  const parentDomain = getConflictingParentCookieDomain();
  if (parentDomain) {
    deleteClientCookie(PLACE_STORAGE_KEY, parentDomain);
  }
}
