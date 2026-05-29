import { LessonTestBody } from "@/src/lib/getCourses";
import { GET, POST } from "@/src/utils/http";

const baseUrl = "/courses/";

export const getCourses = (query = "") => GET(baseUrl + query);

export const getCurrentCourse = (coursePk: number | string) => GET(`${baseUrl}${coursePk}/`);

export const purchase = (coursePk: number) => POST(`${baseUrl}${coursePk}/mock-purchase/`);

export const getLesson = (coursePk: number | string, lessonPk: number | string) =>
  GET(`${baseUrl}${coursePk}/lessons/${lessonPk}/`);

export const getLessonTest = (coursePk: number | string, lessonPk: number | string) =>
  GET(`${baseUrl}${coursePk}/lessons/${lessonPk}/test/`);

export const sendTestAnswers = (
  coursePk: number | string,
  lessonPk: number | string,
  body: LessonTestBody
) => POST(`${baseUrl}${coursePk}/lessons/${lessonPk}/test/`, body);
