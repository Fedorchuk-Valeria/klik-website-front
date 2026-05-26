import CourseAbout from "@/src/components/template-parts/Course/About";
import CourseTutorial from "@/src/components/template-parts/Course/Tutorial";
import BackButton from "@/src/components/ui/BackButton";
import Icon from "@/src/components/ui/Icon/Icon";

import { PAGES } from "@/src/utils/constant";

export const dynamic = "force-dynamic";

export default async function CoursePage() {
  // const { data, errors } = await getCourses();

  const isPayment = true;
  const timing = [
    {
      id: 1,
      title: "24",
      icon: "player",
      description: "урока",
    },
    {
      id: 2,
      icon: "clock",
      title: "3 месяца",
      description: "длительность",
    },
  ];

  return (
    <div className="course-page">
      <div className="course-page__content">
        <BackButton label="К списку курсов" url={PAGES.COURSES} />

        <CourseAbout
          categories={["Программирование", "Python"]}
          infoList={[
            "Видео-уроки в HD качестве",
            "Материалы для скачивания",
            "Домашние задания",
            "Тесты для проверки знаний",
            "ИИ-помощник 24/7",
          ]}
          title="Python для начинающих"
          description="Полный курс по основам программирования на Python. Изучите переменные, циклы, функции, ООП и создайте свои первые проекты."
          price={15990}
          isPayment={isPayment}
        />

        <div className="course-page__content-timing">
          {timing.map((item) => (
            <div key={item.id} className="course-page__content-timing_item">
              <span className="course-page__content-timing_item-icon">
                <Icon name={item.icon} />
              </span>

              <div className="course-page__content-timing_item-content">
                <p>{item.title}</p>
                <span>{item.description}</span>
              </div>
            </div>
          ))}
        </div>

        <CourseTutorial
          progress={1}
          total={4}
          list={[
            {
              id: 1,
              title: "Урок 1",
              duration: "50 минут",
              status: "done",
            },
            {
              id: 2,
              title: "Урок 2",
              duration: "45 минут",
              status: "active",
            },
            {
              id: 3,
              title: "Урок 3",
              duration: "30 минут",
              status: "disabled",
            },
            {
              id: 4,
              title: "Урок 4",
              duration: "35 минут",
              status: "disabled",
            },
          ]}
        />
      </div>
    </div>
  );
}
