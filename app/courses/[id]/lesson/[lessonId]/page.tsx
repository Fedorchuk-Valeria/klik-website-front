import { notFound, redirect } from "next/navigation";

import LayoutPlatform from "@/src/components/Layouts/LayoutPlatform";
import LessonPage from "@/src/components/Pages/LessonPage";
import { HttpStatus } from "@/src/entities/common";

import { getLesson } from "@/src/lib/getCourses";
import { PAGES } from "@/src/utils/constant";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export default async function LessonDetailPage({ params }: PageProps) {
  const { id, lessonId } = await params;
  const { data: lesson, errors, code } = await getLesson(id, lessonId);

  console.log(lesson, errors, code);

  if (code === HttpStatus.Unauthorized) {
    return redirect(PAGES.LOGIN);
  }

  if (code === HttpStatus.Forbidden) {
    return redirect(PAGES.COURSE.replace(":id", id));
  }

  if (code === HttpStatus.NotFound) {
    return notFound();
  }

  return (
    <LayoutPlatform headerVariant="light" showAuthControls={true}>
      <LessonPage id={id} lessonId={lessonId} data={lesson} />
    </LayoutPlatform>
  );
}
