import DefaultPage from "@/src/components/templates/DefaultPage";
import Home from "@/src/components/templates/Home";

const map: Record<string, any> = {
    page: DefaultPage,
    home: Home
};

export function resolveTemplate(template: string) {
    return map[template] || DefaultPage;
}