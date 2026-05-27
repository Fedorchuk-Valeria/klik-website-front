import classNames from "classnames";
import Link from "next/link";
import { FC, memo } from "react";

import Icon from "@/src/components/ui/Icon/Icon";

import CompleteLessonSVG from "@/src/assets/images/view/courses/complete-lesson.svg";
import StepLineSVG from "@/src/assets/images/view/courses/step-line.svg";

type PropTypes = {
  progress: number;
  total: number;
  list: {
    id: number;
    title: string;
    duration: string;
    test_result: number | null;
    status: "done" | "active" | "disabled";
  }[];
  className?: string;
};

const CourseTutorial: FC<PropTypes> = ({ progress, total, list, className }) => {
  return (
    <div className={classNames("course-tutorial", className)}>
      <div className="course-tutorial__progress">
        <div className="course-tutorial__progress-title">
          <p className="course-tutorial__progress-title_text">Прогресс курса</p>
          <p className="course-tutorial__progress-count">
            <span>{progress}/</span>
            {total}
          </p>
        </div>

        <div className="course-tutorial__progress-bar">
          {[...new Array(total).fill(0)].map((_, index) => (
            <div
              key={index}
              className={classNames("course-tutorial__progress-bar_item", {
                "course-tutorial__progress-bar_item--active": index < progress,
              })}
            />
          ))}
        </div>
      </div>

      <div className="course-tutorial__content">
        <p className="course-tutorial__content-title">Содержание курса</p>
        <p className="course-tutorial__content-description">Оплатите курс для доступа к урокам</p>
      </div>

      <ul className="course-tutorial__list">
        {list.map((item, index) => {
          const isDone = item.status === "done";
          const isDisabled = item.status === "disabled";

          const number = index < 10 ? `0${index + 1}` : index + 1;

          return (
            <li
              key={index}
              className={classNames("course-tutorial__list-item", {
                "course-tutorial__list-item--done": isDone,
                "course-tutorial__list-item--disabled": isDisabled,
              })}
            >
              <div className="course-tutorial__list-item--status">
                <StepLineSVG className="course-tutorial__list-item--status-line" />
                {isDone ? (
                  <CompleteLessonSVG className="course-tutorial__list-item--status-icon" />
                ) : (
                  number
                )}
              </div>

              <div className="course-tutorial__list-item_content">
                <div>
                  <p className="course-tutorial__list-item_content-title">{item.title}</p>

                  <p className="course-tutorial__list-item_content-duration">
                    <Icon name={"clock"} /> {item.duration}
                  </p>
                </div>

                <Link href={"#"} className={"course-tutorial__list-item_button"}>
                  <button>
                    <Icon name={isDone ? "test" : isDisabled ? "lock" : "play"} />

                    <span>
                      {isDone ? (
                        <span>
                          <span>Результат теста</span>
                          <span className="course-tutorial__list-item_button-result">
                            : {item?.test_result ?? 0} из 100
                          </span>
                        </span>
                      ) : isDisabled ? (
                        "Заблокирован"
                      ) : (
                        "Перейти к уроку"
                      )}
                    </span>
                  </button>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(CourseTutorial);
