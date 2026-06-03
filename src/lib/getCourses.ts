import { cookies } from "next/headers";

import { Meta } from "@/src/entities/common";

import { buildApiUrl } from "@/src/utils/buildApiUrl";
import { COURSES_PAGE_SIZE, QUERY_PARAMS, TOKEN_KEY } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";
import { normalizeToken } from "@/src/utils/http";
import { normalizeCoursesResponse } from "@/src/utils/normalizeCoursesPayload";

export type Course = {
  categories: CourseCategory[];
  completed_lessons_count: number;
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

export type LessonTestResult = {
  correct_answers: number;
  total_questions: number;
};

export type CourseLesson = {
  id: number;
  number: number;
  title: string;
  duration_minutes: number;
  is_locked: boolean;
  is_completed: boolean;
  test_result: LessonTestResult | null;
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
  meta: Meta;
  errors: Record<string, string> | null;
};

export type CourseFetchResult = {
  data: Course | null;
  errors: Record<string, string> | null;
};

export type Lesson = {
  completed_lessons_count: number;
  course: Pick<Course, "id" | "title" | "progress_percent" | "lessons_count" | "categories">;
  description?: string;
  duration_minutes: number;
  has_test?: boolean;
  has_homework?: boolean;
  has_materials?: boolean;
  materials?: LessonMaterial;
  homework?: Omit<LessonMaterial, "download_url"> & { pdf_url: string | null };
  id: number;
  is_test_passed?: boolean;
  lessons: CourseLesson[];
  number: number;
  title: string;
  test_result?: LessonTestResult;
  video_url?: string;
  total_lessons?: number;
  video?: { video_url: string; video_file: string | null };
};

export type LessonMaterial = {
  has_file: boolean;
  download_url: string | null;
  empty_text: string;
};

export type LessonFetchResult = {
  data: Lesson | null;
  errors: Record<string, string> | null;
  code?: number | null;
};

export type LessonTest = {
  status: "not_passed" | "passed";
  can_start: boolean;
  can_submit: boolean;
  submit_rule: string;
  questions: LessonTestQuestion[];
};

export type LessonTestQuestion = {
  id: number;
  number: number;
  is_correct?: boolean;
  total_questions: number;
  text: string;
  selection_type: "checkbox" | "radio";
  answers: LessonTestAnswer[];
};

export type LessonTestAnswer = {
  id: number;
  text: string;
  is_selected?: boolean;
  is_correct_answer?: boolean;
};

export type LessonTestBody = {
  answers: {
    question_id: number;
    answer_ids: number[];
  }[];
};

export type PassedTest = {
  status: "passed" | "not_passed";
  result: LessonTestResult;
  review: LessonTestQuestion[];
  next_action: {
    type: "lesson";
    course_id: number;
    lesson_id: number;
  };
};

export async function getCourses(query = ""): Promise<CoursesFetchResult> {
  const apiUrl = buildApiUrl(`/courses/${query}`);

  if (!apiUrl) {
    return {
      data: [],
      meta: { page: 1, page_size: COURSES_PAGE_SIZE, total_count: 0, total_pages: 0 },
      errors: { detail: "API URL is not configured" },
    };
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
      return {
        data: [],
        meta: { page: 1, page_size: COURSES_PAGE_SIZE, total_count: 0, total_pages: 0 },
        errors: errorBody,
      };
    }

    const payload: unknown = await response.json();
    const queryParams = QueryHelper.getFromQueryString(query.startsWith("?") ? query : `?${query}`);
    const { data, meta } = normalizeCoursesResponse<Course>(payload, {
      page: Number(queryParams[QUERY_PARAMS.PAGE]) || 1,
      page_size: Number(queryParams[QUERY_PARAMS.PAGE_SIZE]) || COURSES_PAGE_SIZE,
    });

    return { data, meta, errors: null };
  } catch (error) {
    return {
      data: [],
      meta: { page: 1, page_size: COURSES_PAGE_SIZE, total_count: 0, total_pages: 0 },
      errors: { detail: `Failed to fetch courses: ${error}` },
    };
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

export async function getLesson(
  courseId: number | string,
  lessonId: number | string
): Promise<LessonFetchResult> {
  const apiUrl = buildApiUrl(`/courses/${courseId}/lessons/${lessonId}/`);

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
      return { data: null, errors: errorBody, code: response.status };
    }

    const payload = (await response.json()) as Lesson;

    return { data: payload, errors: null };
  } catch (error) {
    return { data: null, errors: { detail: `Failed to fetch lesson: ${error}` } };
  }
}
