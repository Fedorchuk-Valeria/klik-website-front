import { GET } from "@/src/utils/http";

const baseUrl = "/courses/";

export const getCourses = () => GET(baseUrl);
