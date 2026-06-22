import classNames from "classnames";
import { useParams } from "next/navigation";
import { FC, memo } from "react";

import TutorialList from "@/src/components/template-parts/Course/Tutorial/List";
import CourseProgress from "@/src/components/template-parts/Course/Tutorial/Progress";
import { LessonTestResult } from "@/src/lib/getCourses";

type PropTypes = {
  progress: number;
  total: number;
  list: {
    id: number;
    title: string;
    duration: string;
    test_result: LessonTestResult | null;
    status: "done" | "active" | "disabled";
  }[];
  className?: string;
  isPurchased: boolean;
};

const CourseTutorial: FC<PropTypes> = ({ progress, total, list, className, isPurchased }) => {
  const courseId = useParams().id as string;

  return (
    <div className={classNames("course-tutorial", className)}>
      <CourseProgress progress={progress} total={total} />

      <div className="course-tutorial__content">
        <p className="course-tutorial__content-title">Содержание курса</p>

        {!isPurchased && (
          <p className="course-tutorial__content-description">Оплатите курс для доступа к урокам</p>
        )}
      </div>

      <TutorialList list={list} courseId={courseId} />
    </div>
  );
};

export default memo(CourseTutorial);
