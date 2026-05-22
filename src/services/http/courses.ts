import { GET } from "@/src/utils/http";

const baseUrl = "/courses/";

export const getCourses = (query = "") => GET(baseUrl + query);
