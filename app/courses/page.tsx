import { cookies } from "next/headers";

import LayoutPlatform from "@/src/components/Layouts/LayoutPlatform";
import PagesCourses from "@/src/components/Pages/PagesCourses/PagesCourses";

import { getCourses } from "@/src/lib/getCourses";

import {
  COURSES_PAGE_SIZE,
  QUERY_PARAMS,
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
} from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const cookieStore = await cookies();
  const initialIsLoggedIn =
    !!cookieStore.get(TOKEN_KEY)?.value && !!cookieStore.get(REFRESH_TOKEN_KEY)?.value;

  const query = QueryHelper.getQueryString({
    [QUERY_PARAMS.PAGE]: 1,
    [QUERY_PARAMS.PAGE_SIZE]: COURSES_PAGE_SIZE,
  });

  const { data, meta, errors } = await getCourses(query);

  return (
    <LayoutPlatform headerVariant="dark" showAuthControls={true}>
      <PagesCourses
        initialCourses={data}
        initialMeta={meta}
        initialErrors={errors}
        initialIsLoggedIn={initialIsLoggedIn}
      />
    </LayoutPlatform>
  );
}
