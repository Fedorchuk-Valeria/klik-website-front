import { notFound } from "next/navigation";

import LayoutPlatform from "@/src/components/Layouts/LayoutPlatform";
import CoursePage from "@/src/components/Pages/CoursePage";
import { getCitySettings } from "@/src/lib/getCitySettings";
import { getCurrentCourse } from "@/src/lib/getCourses";
import { QUERY_PARAMS } from "@/src/utils/constant";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CourseDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const isParent = query[QUERY_PARAMS.IS_PARENT] === "true";
  const { data: course, errors } = await getCurrentCourse(id);
  const settings = getCitySettings("minsk");

  console.log("CourseDetailPage", course, errors);

  if (!course) {
    notFound();
  }

  return (
    <LayoutPlatform headerVariant="light" showAuthControls={true}>
      <CoursePage data={course} errors={errors ?? null} settings={settings} isParent={isParent} />
    </LayoutPlatform>
  );
}
