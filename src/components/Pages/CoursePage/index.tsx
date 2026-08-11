"use client";

import { useSearchParams } from "next/navigation";
import { FC, useEffect, useMemo } from "react";

import CourseAbout from "@/src/components/template-parts/Course/About";
import CourseTutorial from "@/src/components/template-parts/Course/Tutorial";
import BackButton from "@/src/components/ui/BackButton";
import Icon from "@/src/components/ui/Icon/Icon";

import { ModalType } from "@/src/entities/common";
import { getPlural } from "@/src/helper/getPlural";
import { CitySettings } from "@/src/lib/getCitySettings";
import { Course } from "@/src/lib/getCourses";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { showModal } from "@/src/store/slices/modalSlice";
import { PAGES, QUERY_PARAMS } from "@/src/utils/constant";
import { useAuth } from "@/src/utils/useAuth";

type PropTypes = {
  data: Course;
  errors: Record<string, string> | null;
  settings: CitySettings;
};

const CoursePage: FC<PropTypes> = ({ data, errors, settings }) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { user_profile } = useAppSelector((state) => state.auth);
  const { isMounted, isAuthenticated } = useAuth();
  const isParent = isMounted && isAuthenticated && user_profile?.role === "parent";
  const isChild = isMounted && isAuthenticated && user_profile?.role === "child";
  const isParentLookAtChild = !!isParent && !!searchParams.get(QUERY_PARAMS.CHILD_ID);

  console.log("isChild=", isChild);
  console.log("isParentLookAtChild=", isParentLookAtChild);

  console.log(data);

  if (errors) {
    console.error(errors);
  }

  const timing = useMemo(
    () => [
      {
        id: 1,
        title: data.lessons_count,
        icon: "player",
        description: getLessons(data?.lessons_count ?? 0).split(" ")[1] || "",
      },
      {
        id: 2,
        icon: "clock",
        title: `${getMonths(data?.duration_months)}`,
        description: "длительность",
      },
    ],
    [data.lessons_count, data.duration_months]
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

  useEffect(() => {
    const payment = data?.payment;

    if (!payment || !payment.show_status_modal) {
      return;
    }

    dispatch(
      showModal({
        modalType: ModalType.PAYMENT_STATUS,
        modalProps: {
          payment: payment,
          settings,
        },
      })
    );
  }, [dispatch, settings, data?.payment]);

  return (
    <div className="course-page">
      <div className="course-page__content">
        <BackButton label="К списку курсов" url={PAGES.COURSES} />

        <CourseAbout
          purchase={data.purchase}
          categories={data.categories}
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
          isChild={isChild}
          isParentLookAtChild={isParentLookAtChild}
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
          progress={data?.completed_lessons_count ?? 0}
          total={data?.lessons_count ?? 0}
          isPurchased={data.is_purchased}
          list={
            (data?.lessons || [])?.map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              test_result: lesson.test_result,
              duration: getTime(lesson.duration_minutes) || "",
              status: lesson.is_completed ? "done" : lesson.is_locked ? "disabled" : "active",
            })) ?? []
          }
          isParent={isParent}
        />
      </div>
    </div>
  );
};

export function getLessons(count: number) {
  return getPlural(count, ["%d урок", "%d урока", "%d уроков"]);
}

export function getMonths(months: number) {
  return getPlural(months, ["%d месяц", "%d месяца", "%d месяцев"]);
}

export function getTime(time: number) {
  return getPlural(time, ["%d минута", "%d минуты", "%d минут"]);
}

export default CoursePage;
