import { LessonTestBody } from "@/src/lib/getCourses";
import { GET, POST } from "@/src/utils/http";

const baseUrl = "/courses/";

export interface PurchasePayload {
  course_id: number;
  return_url: string;
}

export const getCourses = (query = "") => GET(baseUrl + query);

export const getCurrentCourse = (coursePk: number | string) => GET(`${baseUrl}${coursePk}/`);

export const purchase = (data: PurchasePayload) =>
  POST(`${baseUrl}payments/bepaid/`, data);
export const getLesson = (coursePk: number | string, lessonPk: number | string) =>
  GET(`${baseUrl}${coursePk}/lessons/${lessonPk}/`);

export const getLessonTest = (coursePk: number | string, lessonPk: number | string) =>
  GET(`${baseUrl}${coursePk}/lessons/${lessonPk}/test/`);

export const sendTestAnswers = (
  coursePk: number | string,
  lessonPk: number | string,
  body: LessonTestBody
) => POST(`${baseUrl}${coursePk}/lessons/${lessonPk}/test/`, body);
