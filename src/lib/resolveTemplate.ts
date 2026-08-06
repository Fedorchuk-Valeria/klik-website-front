import { JSX } from "react";

import DefaultPage from "@/src/components/templates/DefaultPage";
import Home from "@/src/components/templates/Home";
import ProgramView from "@/src/components/templates/Program";

import { Page } from "./content/types";

const map: Record<string, ({ page }: { page: Page }) => JSX.Element | Promise<JSX.Element>> = {
  page: DefaultPage,
  home: Home,
  program: ProgramView,
};

export function resolveTemplate(template: string) {
  return map[template] || DefaultPage;
}
