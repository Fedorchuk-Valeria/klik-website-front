import { notFound } from "next/navigation";

import LayoutPlatform from "@/src/components/Layouts/LayoutPlatform";
import CoursePage from "@/src/components/Pages/CoursePage";
import { getCurrentCourse } from "@/src/lib/getCourses";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: course, errors } = await getCurrentCourse(id);

  console.log(course, errors);

  if (!course) {
    notFound();
  }

  return (
    <LayoutPlatform headerVariant="light" showAuthControls={true}>
      <CoursePage data={course} errors={errors ?? null} />
    </LayoutPlatform>
  );
}
