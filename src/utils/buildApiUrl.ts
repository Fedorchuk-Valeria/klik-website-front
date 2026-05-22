import { API_URL } from "@/src/utils/constant";

/** Сборка URL так же, как axios combineURLs(baseURL, path). */
export function buildApiUrl(path: string): string {
  if (!API_URL) return "";

  const base = API_URL.replace(/\/+$/, "");
  const relative = path.replace(/^\/+/, "");

  return `${base}/${relative}`;
}
