import {
  HomePageContent,
  WhatWeLearnContentItem,
} from "@/src/lib/content/types";
import {
  UsersDirectionsResponse
} from "@/src/services/http/users";
import { buildApiUrl } from "@/src/utils/buildApiUrl";

export type HomeWhatWeLearn = NonNullable<HomePageContent["what_we_learn"]>;
function mapApiDirections(data: UsersDirectionsResponse): Pick<HomeWhatWeLearn, "items"> {
  const items: WhatWeLearnContentItem[] = [...data.results]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((direction) => ({
      title: direction.title,
      key: String(direction.id),
      text: direction.description,
      items: [...direction.items]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => ({
          text: item.text,
          icon: item.icon,
        })),
    }));

  return { items };
}
async function fetchWhatWeLearnFromApi(): Promise<Pick<HomeWhatWeLearn, "items"> | null> {
  const apiUrl = buildApiUrl("/users/directions/");

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

    const data = (await response.json()) as UsersDirectionsResponse;

    return mapApiDirections(data);
  } catch {
    return null;
  }
}

export async function getHomeWhatWeLearn(
  cmsWhatWeLearn?: HomeWhatWeLearn
): Promise<HomeWhatWeLearn | null> {
  const apiDirections = await fetchWhatWeLearnFromApi();

  if (!cmsWhatWeLearn && !apiDirections) {
    return null;
  }

  return {
    ...cmsWhatWeLearn,
    ...apiDirections,
  };
}
