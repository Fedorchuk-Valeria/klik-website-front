import type { TutorItem } from "@/src/components/template-parts/Tutors/types";
import { HomePageContent } from "@/src/lib/content/types";
import { UsersMentorsResponse } from "@/src/services/http/users";
import { buildApiUrl } from "@/src/utils/buildApiUrl";

export type HomeTutors = NonNullable<HomePageContent["our_tutors"]>;

function mapApiMentors(data: UsersMentorsResponse): Pick<HomeTutors, "items"> {
  const items: TutorItem[] = [...data.results]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((mentor) => ({
      id: String(mentor.id),
      name: mentor.full_name,
      position: mentor.position,
      text: mentor.description,
      location: mentor.city_name,
      tags: mentor.specializations.map((specialization) => specialization.name),
      photo: mentor.photo,
    }));

  return { items };
}

async function fetchTutorsFromApi(): Promise<Pick<HomeTutors, "items"> | null> {
  const apiUrl = buildApiUrl("/users/mentors/");

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

    const data = (await response.json()) as UsersMentorsResponse;

    return mapApiMentors(data);
  } catch {
    return null;
  }
}

export async function getHomeTutors(cmsTutors?: HomeTutors): Promise<HomeTutors | null> {
  const apiTutors = await fetchTutorsFromApi();

  if (!cmsTutors && !apiTutors) {
    return null;
  }

  return {
    ...cmsTutors,
    ...apiTutors,
  };
}
