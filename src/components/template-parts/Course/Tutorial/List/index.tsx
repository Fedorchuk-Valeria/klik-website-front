"use client";

import classNames from "classnames";
import Link from "next/link";
import { FC } from "react";

import Icon from "@/src/components/ui/Icon/Icon";

import CompleteLessonSVG from "@/src/assets/images/view/courses/complete-lesson.svg";
import StepLineSVG from "@/src/assets/images/view/courses/step-line.svg";

import { PAGES } from "@/src/utils/constant";

type PropTypes = {
  className?: string;
  onClick?: (id: number | null) => void;
  isHideButton?: boolean;
  courseId?: string;
  list: {
    id: number;
    title: string;
    duration: string;
    test_result: number | null;
    status: "done" | "active" | "disabled";
  }[];
};

const TutorialList: FC<PropTypes> = ({ list, className, onClick, isHideButton, courseId }) => {
  return (
    <ul className={classNames("course-tutorial__list", className)}>
      {list.map((item, index) => {
        const isDone = item.status === "done";
        const isDisabled = item.status === "disabled";

        const number = index < 10 ? `0${index + 1}` : index + 1;

        return (
          <li
            onClick={() => onClick?.(isDisabled ? null : item.id)}
            key={index}
            className={classNames("course-tutorial__list-item", {
              "course-tutorial__list-item--clickable": !!onClick,
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

              {!isHideButton && (
                <Link
                  href={
                    isDisabled
                      ? "#"
                      : isDone
                        ? "#"
                        : PAGES.LESSON.replace(":id", courseId ?? "").replace(
                            ":lessonId",
                            item.id.toString()
                          )
                  }
                  className={"course-tutorial__list-item_button"}
                >
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
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TutorialList;
