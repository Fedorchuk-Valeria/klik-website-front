import { Page } from "@/src/lib/content/types";
import fs from "fs";
import path from "path";

const cache = new Map<string, Page | null>();

export function getPage(city: string, slug: string): Page | null {
  const key = `${city}:${slug}`;

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  try {
    const filePath = path.join(process.cwd(), "src/content", city, "pages", `${slug}.json`);

    if (!fs.existsSync(filePath)) {
      cache.set(key, null);
      return null;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const page = JSON.parse(raw) as Page;

    cache.set(key, page);

    return page;
  } catch (error) {
    cache.set(key, null);

    console.error("page error", error);

    return null;
  }
}
