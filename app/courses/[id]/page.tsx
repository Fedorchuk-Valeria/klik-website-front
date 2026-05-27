import CoursePage from "@/src/components/Pages/CoursePage";
import { getCurrentCourse } from "@/src/lib/getCourses";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: course, errors } = await getCurrentCourse(id);

  if (!course) {
    notFound();
  }

  return <CoursePage data={course} errors={errors ?? null} />;
}
