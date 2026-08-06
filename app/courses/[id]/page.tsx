import { notFound } from "next/navigation";

import LayoutPlatform from "@/src/components/Layouts/LayoutPlatform";
import CoursePage from "@/src/components/Pages/CoursePage";
import { getCitySettings } from "@/src/lib/getCitySettings";
import { getCurrentCourse } from "@/src/lib/getCourses";
import { buildApiUrl } from "@/src/utils/buildApiUrl";
import { API_URL, QUERY_PARAMS } from "@/src/utils/constant";

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
  const childId = query[QUERY_PARAMS.CHILD_ID] as string;
  const endpoint = `/courses/${id}/${childId ? `?${QUERY_PARAMS.CHILD_ID}=${childId}` : ""}`;
  const fullUrl = buildApiUrl(endpoint);

  console.log("[CoursePage] server API request", {
    apiBase: API_URL ?? "(not set)",
    endpoint,
    fullUrl: fullUrl || "(empty)",
    courseId: id,
    childId: childId ?? null,
  });

  const { data: course, errors } = await getCurrentCourse(id, childId);
  const settings = getCitySettings("minsk");

  if (!course) {
    notFound();
  }

  return (
    <LayoutPlatform headerVariant="light" showAuthControls={true}>
      <CoursePage data={course} errors={errors ?? null} settings={settings} />
    </LayoutPlatform>
  );
}
