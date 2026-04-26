import striptags from "striptags";
export const stripHtml = (html: string): string => {
    return striptags(html);
};