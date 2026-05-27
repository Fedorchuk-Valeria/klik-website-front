import { cookies } from "next/headers";

import { buildApiUrl } from "@/src/utils/buildApiUrl";
import { TOKEN_KEY } from "@/src/utils/constant";
import { normalizeToken } from "@/src/utils/http";
import { normalizeCoursesPayload } from "@/src/utils/normalizeCoursesPayload";

export type Course = {
  categories: CourseCategory[];
  created_at: string;
  description: string;
  duration_months: number;
  id: number;
  image: string;
  is_purchased: boolean;
  lessons?: CourseLesson[];
  lessons_count?: number;
  price: number;
  primary_action: CoursePrimaryAction;
  progress_percent: number;
  title: string;
  updated_at: string;
};

export type CourseLesson = {
  id: number;
  number: number;
  title: string;
  duration_minutes: number;
  is_locked: boolean;
  is_completed: boolean;
  test_result: number | null;
};

export type CoursePrimaryAction = {
  type: "continue_learning";
  label: string;
  course_list_query: {
    scope: string;
    categories: string[];
  };
};

export type CourseCategory = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};

export type CoursesFetchResult = {
  data: Course[];
  errors: Record<string, string> | null;
};

export type CourseFetchResult = {
  data: Course | null;
  errors: Record<string, string> | null;
};

export async function getCourses(): Promise<CoursesFetchResult> {
  const apiUrl = buildApiUrl("/courses/");

  if (!apiUrl) {
    return { data: [], errors: { detail: "API URL is not configured" } };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_KEY)?.value;
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(token ? { Authorization: normalizeToken(token) } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as Record<string, string> | null;
      return { data: [], errors: errorBody };
    }

    const payload: unknown = await response.json();

    return { data: normalizeCoursesPayload<Course>(payload), errors: null };
  } catch (error) {
    return { data: [], errors: { detail: `Failed to fetch courses: ${error}` } };
  }
}

export async function getCurrentCourse(courseId: number | string): Promise<CourseFetchResult> {
  const apiUrl = buildApiUrl(`/courses/${courseId}/`);

  if (!apiUrl) {
    return { data: null, errors: { detail: "API URL is not configured" } };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_KEY)?.value;
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(token ? { Authorization: normalizeToken(token) } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as Record<string, string> | null;
      return { data: null, errors: errorBody };
    }

    const payload = (await response.json()) as Course;

    return { data: payload, errors: null };
  } catch (error) {
    return { data: null, errors: { detail: `Failed to fetch course: ${error}` } };
  }
}
