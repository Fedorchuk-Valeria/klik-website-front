import { GET, POST } from "@/src/utils/http";

const baseUrl = "/assistant";

export const getChat = (courseId: number | string, lessonId: number | string) =>
  GET(`${baseUrl}/courses/${courseId}/lessons/${lessonId}/chat/`);

export const sendChatMessage = (
  courseId: number | string,
  lessonId: number | string,
  message: string
) => POST(`${baseUrl}/courses/${courseId}/lessons/${lessonId}/chat/`, { message });
