import { notFound, redirect } from "next/navigation";

import LayoutPlatform from "@/src/components/Layouts/LayoutPlatform";
import TestPageComponent from "@/src/components/Pages/TestPage";

import { HttpStatus } from "@/src/entities/common";
import { getTest } from "@/src/lib/getCourses";
import { PAGES, QUERY_PARAMS } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";

type PageProps = {
  params: Promise<{
    id: string;
    userId: string;
    lessonId: string;
  }>;
};

export default async function TestPage({ params }: PageProps) {
  const { id, lessonId, userId } = await params;
  const { data, errors, code } = await getTest(id, lessonId, userId);

  console.log("LessonDetailPage", data, errors, code);

  if (code === HttpStatus.Forbidden) {
    return redirect(
      PAGES.COURSE.replace(":id", id) +
        QueryHelper.getQueryString({ [QUERY_PARAMS.IS_PARENT]: "true" })
    );
  }

  if (code === HttpStatus.NotFound) {
    return notFound();
  }

  return (
    <LayoutPlatform headerVariant="light" showAuthControls={true}>
      <TestPageComponent data={data} userId={userId} id={id} />
    </LayoutPlatform>
  );
}
