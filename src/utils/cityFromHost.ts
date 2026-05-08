const IT_KLIK_DOMAIN = "it-klik.by";

export type ItKlikCitySlug = "minsk" | "baranovichi" | "borisov" | "novopolotsk";

const SUBDOMAIN_BY_SLUG: Record<ItKlikCitySlug, string> = {
  minsk: "minsk",
  baranovichi: "baranovichi",
  borisov: "borisov",
  novopolotsk: "novopolotsk",
};

const SLUG_BY_SUBDOMAIN = Object.fromEntries(
  Object.entries(SUBDOMAIN_BY_SLUG).map(([slug, sub]) => [sub, slug as ItKlikCitySlug])
) as Record<string, ItKlikCitySlug>;

const CITY_DISPLAY_NAME: Record<ItKlikCitySlug, string> = {
  minsk: "Минск",
  baranovichi: "Барановичи",
  borisov: "Борисов",
  novopolotsk: "Новополоцк",
};

function normalizeHost(host: string): string {
  return host.trim().toLowerCase().split(":")[0] ?? "";
}

export function getCitySlugFromHost(hostname: string): ItKlikCitySlug {
  const h = normalizeHost(hostname);

  if (h === IT_KLIK_DOMAIN || h === `www.${IT_KLIK_DOMAIN}`) {
    return "minsk";
  }

  const suffix = `.${IT_KLIK_DOMAIN}`;
  if (!h.endsWith(suffix)) {
    return "minsk";
  }

  const sub = h.slice(0, -suffix.length);
  if (sub.includes(".")) {
    return "minsk";
  }

  const slug = SLUG_BY_SUBDOMAIN[sub];
  return slug ?? "minsk";
}

export function getCityFromHost(hostname: string): string {
  return CITY_DISPLAY_NAME[getCitySlugFromHost(hostname)];
}
