import path from "path";
import fs from "fs";
import { SocialItem } from "@/src/components/ui/Socials/Socials";

export type CitySettings = {
  socials?: SocialItem[];
  phone?: string;
  address?: string;
  email?: string;
};

const defaultSettings: CitySettings = {
  socials: [],
  phone: "+375 (29) 633-27-79",
  address: "г. Минск, ул. Аэродромная, 125, каб. 29",
  email: "info@it-klik.by",
};

const settingsCache = new Map<string, CitySettings>();

export function getCitySettings(city: string): CitySettings {
  if (settingsCache.has(city)) {
    return settingsCache.get(city)!;
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "src/content",
      city,
      "settings.json"
    );

    let citySettings: Partial<CitySettings> = {};

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      citySettings = JSON.parse(raw);
    }

    const merged: CitySettings = {
      ...defaultSettings,
      ...citySettings,
      socials: citySettings.socials ?? defaultSettings.socials,
    };

    settingsCache.set(city, merged);

    return merged;
  } catch (e) {
    console.error("settings error", e);

    settingsCache.set(city, defaultSettings);

    return defaultSettings;
  }
}
