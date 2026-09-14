import { HomePageContent } from "@/src/lib/content/types";
import { UsersLocationsResponse } from "@/src/services/http/users";
import { buildApiUrl } from "@/src/utils/buildApiUrl";

export type HomeLocations = NonNullable<HomePageContent["location"]>;

function mapApiLocations(
  data: UsersLocationsResponse
): Pick<
  HomeLocations,
  "city" | "city_name" | "city_map_url" | "online_registration_url" | "results"
> {
  return {
    city: data.city,
    city_name: data.city_name,
    city_map_url: data.city_map_url,
    online_registration_url: data.online_registration_url,
    results: data.results,
  };
}

async function fetchLocationsFromApi(): Promise<Pick<
  HomeLocations,
  "city" | "city_name" | "city_map_url" | "online_registration_url" | "results"
> | null> {
  const apiUrl = buildApiUrl("/users/locations/");

  if (!apiUrl) {
    return null;
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as UsersLocationsResponse;

    return mapApiLocations(data);
  } catch {
    return null;
  }
}

export async function getHomeLocations(cmsLocation?: HomeLocations): Promise<HomeLocations | null> {
  const apiLocations = await fetchLocationsFromApi();

  if (!cmsLocation && !apiLocations) {
    return null;
  }

  return {
    ...cmsLocation,
    ...apiLocations,
  };
}
