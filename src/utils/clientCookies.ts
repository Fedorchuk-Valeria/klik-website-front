/** ~30 days — shared prefs across subdomains via Domain=.root */
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function hostnameFromEnv(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_APP_ROOT_DOMAIN?.trim();
  if (!raw) return undefined;
  return raw.split(":")[0] || undefined;
}

/** Leading-dot domain for cross-subdomain cookies; omitted on localhost. */
export function getClientCookieDomain(): string | undefined {
  const host = hostnameFromEnv();
  if (!host) return undefined;
  if (host === "localhost" || host === "127.0.0.1") return undefined;
  const base = host.startsWith(".") ? host.slice(1) : host;
  return `.${base}`;
}

export function getClientCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
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
