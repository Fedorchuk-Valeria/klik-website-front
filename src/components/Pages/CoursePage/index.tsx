"use client";

import { FC, useMemo } from "react";

import CourseAbout from "@/src/components/template-parts/Course/About";
import CourseTutorial from "@/src/components/template-parts/Course/Tutorial";
import BackButton from "@/src/components/ui/BackButton";
import Icon from "@/src/components/ui/Icon/Icon";

import { ModalType } from "@/src/entities/common";
import { Course } from "@/src/lib/getCourses";
import { PAGES } from "@/src/utils/constant";

import { useAppDispatch } from "@/src/store/hooks";
import { showModal } from "@/src/store/slices/modalSlice";

type PropTypes = {
  data: Course;
  errors: Record<string, string> | null;
};

const CoursePage: FC<PropTypes> = ({ data, errors }) => {
  const dispatch = useAppDispatch();

  if (errors) {
    console.error(errors);
  }

  const timing = useMemo(
    () => [
      {
        id: 1,
        title: data?.lessons_count,
        icon: "player",
        description: "урока",
      },
      {
        id: 2,
        icon: "clock",
        title: `${data.duration_months} ${getMonths(data.duration_months)}`,
        description: "длительность",
      },
    ],
    [data?.lessons_count, data.duration_months]
  );

  const handlePayment = () => {
    dispatch(
      showModal({
        modalType: ModalType.PAYMENT,
        modalProps: {
          course: data,
        },
      })
    );
  };

  return (
    <div className="course-page">
      <div className="course-page__content">
        <BackButton label="К списку курсов" url={PAGES.COURSES} />

        <CourseAbout
          categories={data.categories.map((category) => category.name)}
          infoList={[
            "Видео-уроки в HD качестве",
            "Материалы для скачивания",
            "Домашние задания",
            "Тесты для проверки знаний",
            "ИИ-помощник 24/7",
          ]}
          title={data.title}
          description={data.description}
          price={data.price}
          imageUrl={data.image}
          isPayment={data.is_purchased}
          onPayment={handlePayment}
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
          progress={data?.progress_percent ?? 0}
          total={data?.lessons_count ?? 0}
          isPurchased={data.is_purchased}
          list={
            (data?.lessons || [])?.map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              test_result: lesson.test_result,
              duration: `${lesson.duration_minutes} ${getTime(lesson.duration_minutes)}`,
              status: lesson.is_completed ? "done" : lesson.is_locked ? "disabled" : "active",
            })) ?? []
          }
        />
      </div>
    </div>
  );
};

function getMonths(months: number) {
  switch (months) {
    case 1:
      return "месяц";
    case 2:
    case 3:
    case 4:
      return "месяца";
    default:
      return "месяцев";
  }
}

function getTime(time: number) {
  switch (time) {
    case 1:
      return "минута";
    case 2:
    case 3:
    case 4:
      return "минуты";
    default:
      return "минут";
  }
}

export default CoursePage;
