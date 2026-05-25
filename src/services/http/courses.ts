import {GET, POST} from "@/src/utils/http";

const baseUrl = "/courses/";

export const getCourses = (query = "") => GET(baseUrl + query);

export const purchase = (coursePk: number) => POST(`${baseUrl}${coursePk}/mock-purchase/`);
