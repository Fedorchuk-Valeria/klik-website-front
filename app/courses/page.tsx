import PagesCourses from "@/src/components/Pages/PagesCourses/PagesCourses";
import { getCourses } from "@/src/lib/getCourses";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const { data, errors } = await getCourses();

  return <PagesCourses initialCourses={data} initialErrors={errors} />;
}
