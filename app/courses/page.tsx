import LayoutPlatform from "@/src/components/Layouts/LayoutPlatform";
import PagesCourses from "@/src/components/Pages/PagesCourses/PagesCourses";
import { getCourses } from "@/src/lib/getCourses";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const { data, errors } = await getCourses();

  return (
    <LayoutPlatform headerVariant="dark" showAuthControls={true}>
      <PagesCourses initialCourses={data} initialErrors={errors} />
    </LayoutPlatform>
  );
}
