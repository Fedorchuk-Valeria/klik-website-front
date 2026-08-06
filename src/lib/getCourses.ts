import { cookies } from "next/headers";

import { Meta } from "@/src/entities/common";

import { buildApiUrl } from "@/src/utils/buildApiUrl";
import {
  COURSES_PAGE_SIZE,
  PAYMENT_STATUS_FAILED,
  PAYMENT_STATUS_SUCCESSFULL,
  QUERY_PARAMS,
  TOKEN_KEY,
} from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";
import { normalizeToken } from "@/src/utils/http";
import { normalizeCoursesResponse } from "@/src/utils/normalizeCoursesPayload";

function serializeFetchError(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const cause =
    error.cause instanceof Error
      ? error.cause.message
      : error.cause != null
        ? String(error.cause)
        : "";

  return cause ? `${error.message} (cause: ${cause})` : error.message;
}

export type CoursePaymentStatus = typeof PAYMENT_STATUS_SUCCESSFULL | typeof PAYMENT_STATUS_FAILED;

export type CoursePayment = {
  download_url: string;
  error: string;
  has_receipt: boolean;
  payment_id: number;
  receipt_url: string;
  saved_at: string;
  show_status_modal: boolean;
  status: CoursePaymentStatus;
};

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
  payment: CoursePayment | null;
  purchase: Purchase | null;
};

export type Purchase = {
  purchased_at: string;
  expires_at: string;
  date_range: string;
  is_active: boolean;
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

export type LessonTestFetchResult = {
  data:
    | (PassedTest & {
        completed_lessons_count: number;
        has_test: boolean;
        is_test_passed: boolean;
        test_result: {
          correct_answers: number;
          total_questions: number;
          percent: number;
        };
      })
    | null;
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
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const apiUrl = buildApiUrl(`/courses/${query}`);

  if (!apiUrl) {
    console.error("[getCourses] API URL is not configured");
    return {
      data: [],
      meta: { page: 1, page_size: COURSES_PAGE_SIZE, total_count: 0, total_pages: 0 },
      errors: {
        detail: "API URL is not configured",
        configuredBaseUrl,
      },
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
      console.error("[getCourses] HTTP error", { apiUrl, status: response.status, errorBody });
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
    const detail = serializeFetchError(error);

    console.error("[getCourses] fetch failed", {
      apiUrl,
      configuredBaseUrl,
      detail,
      error,
    });

    return {
      data: [],
      meta: { page: 1, page_size: COURSES_PAGE_SIZE, total_count: 0, total_pages: 0 },
      errors: {
        detail: `Failed to fetch courses: ${detail}`,
        apiUrl,
        configuredBaseUrl,
      },
    };
  }
}

export async function getCurrentCourse(
  courseId: number | string,
  childId?: string
): Promise<CourseFetchResult> {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const apiUrl = buildApiUrl(
    `/courses/${courseId}/${childId ? `?${QUERY_PARAMS.CHILD_ID}=${childId}` : ""}`
  );

  if (!apiUrl) {
    console.error("[getCurrentCourse] API URL is not configured");
    return {
      data: null,
      errors: {
        detail: "API URL is not configured",
        configuredBaseUrl,
        courseId: String(courseId),
        childId: childId ?? "",
      },
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
      console.error("[getCurrentCourse] HTTP error", {
        apiUrl,
        courseId,
        childId: childId ?? null,
        status: response.status,
        errorBody,
      });
      return { data: null, errors: errorBody };
    }

    const payload = (await response.json()) as Course;

    return { data: payload, errors: null };
  } catch (error) {
    const detail = serializeFetchError(error);

    console.error("[getCurrentCourse] fetch failed", {
      apiUrl,
      configuredBaseUrl,
      courseId,
      childId: childId ?? null,
      detail,
      error,
    });

    return {
      data: null,
      errors: {
        detail: `Failed to fetch course: ${detail}`,
        apiUrl,
        configuredBaseUrl,
        courseId: String(courseId),
        childId: childId ?? "",
      },
    };
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

    return { data: payload, errors: null, code: response.status };
  } catch (error) {
    return { data: null, errors: { detail: `Failed to fetch lesson: ${error}` }, code: null };
  }
}

export async function getTest(
  courseId: number | string,
  lessonId: number | string,
  userId?: number | string
): Promise<LessonTestFetchResult> {
  console.log("getTest", courseId, lessonId, userId);

  const apiUrl = buildApiUrl(
    `/courses/${courseId}/lessons/${lessonId}/test/?${QUERY_PARAMS.CHILD_ID}=${userId}`
  );

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

    const payload = (await response.json()) as LessonTestFetchResult["data"];

    return { data: payload, errors: null };
  } catch (error) {
    return { data: null, errors: { detail: `Failed to fetch lesson: ${error}` } };
  }
}
