"use client";

import classNames from "classnames";
import Image from "next/image";
import { FC, useCallback, useState } from "react";

import TestSVG from "@/src/assets/images/test.svg";

import TestCard from "@/src/components/template-parts/Test/TestCard";
import Button from "@/src/components/ui/Button/Button";
import Loader from "@/src/components/ui/Loader/Loader";

import { LessonTest } from "@/src/lib/getCourses";

type PropTypes = {
  title: string;
  description: string;
  className?: string;
  data: LessonTest | null;
  onStartTestClick: () => void;
  isTestLoading: boolean;
};

type TestAnswers = Record<number, number[]>;

const Test: FC<PropTypes> = ({
  data,
  title,
  description,
  className,
  onStartTestClick,
  isTestLoading,
}) => {
  const [isStarted, setStarted] = useState(false);
  const [answers, setAnswers] = useState<TestAnswers>({});

  const handleAnswerChange = useCallback(
    (
      questionId: number,
      answerId: number,
      selectionType: "checkbox" | "radio",
      checked: boolean
    ) => {
      setAnswers((prev) => {
        const selected = prev[questionId] ?? [];

        if (selectionType === "radio") {
          return checked ? { ...prev, [questionId]: [answerId] } : prev;
        }

        const nextSelected = checked
          ? [...selected, answerId]
          : selected.filter((id) => id !== answerId);

        return { ...prev, [questionId]: nextSelected };
      });
    },
    []
  );

  const handleClick = () => {
    if (isStarted) {
      console.log("finish", answers);
    } else {
      setAnswers({});
      setStarted(true);
      onStartTestClick();
    }
  };

  return (
    <div
      className={classNames("test", className, {
        "test--started": isStarted,
      })}
    >
      <span className="test__icon">
        <TestSVG />
      </span>

      <div className="test__content">
        <div className="test__content-info">
          <p className="test__content-title">{title}</p>
          <p className="test__content-description">{description}</p>

          {isStarted && !isTestLoading && (
            <div className="test__content-list">
              {data?.questions.map((question) => (
                <TestCard
                  key={question.id}
                  id={question.number < 10 ? `0${question.number}` : question.number}
                  questionId={question.id}
                  title={question.text}
                  description={
                    question.selection_type === "checkbox"
                      ? "Выберите несколько вариантов ответа"
                      : "Выберите один вариант ответа"
                  }
                  answers={question.answers}
                  selectionType={question.selection_type}
                  selectedAnswerIds={answers[question.id] ?? []}
                  onAnswerChange={(answerId, checked) =>
                    handleAnswerChange(question.id, answerId, question.selection_type, checked)
                  }
                />
              ))}
            </div>
          )}

          {isStarted && isTestLoading && <Loader isLocal />}

          <Button
            className="test__button"
            variant="main-green-dark"
            onClick={handleClick}
            disabled={isTestLoading}
            withArrow
          >
            {isStarted ? "Завершить тест" : "Начать тест"}
          </Button>
        </div>

        <div className="test__image">
          <Image
            fill
            alt={title}
            src="https://placehold.co/600x400.png"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>
      </div>
    </div>
  );
};

export default Test;
