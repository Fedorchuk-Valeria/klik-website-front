const MEDIA_HOSTS = new Set(["test.it-klik.by", "it-klik.by", "www.it-klik.by"]);

function getAppHostname(): string | undefined {
  return process.env.NEXT_PUBLIC_APP_ROOT_DOMAIN?.split(":")[0];
}

/** Ensures API media URLs use https so the browser loads them from nginx/backend, not via next/image. */
export function normalizeMediaUrl(url: string | undefined | null): string {
  if (!url?.startsWith("http")) return url ?? "";

  try {
    const parsed = new URL(url);
    const appHost = getAppHostname();
    const isMediaHost =
      MEDIA_HOSTS.has(parsed.hostname) || (appHost != null && parsed.hostname === appHost);

    if (parsed.protocol === "http:" && isMediaHost) {
      parsed.protocol = "https:";
    }

    return parsed.toString();
  } catch {
    return url;
  }
}
