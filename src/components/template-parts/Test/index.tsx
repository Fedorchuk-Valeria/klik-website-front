"use client";

import classNames from "classnames";
import Image from "next/image";
import { FC, useCallback, useMemo, useState } from "react";

import TestSVG from "@/src/assets/images/test.svg";

import TestCard from "@/src/components/template-parts/Test/TestCard";
import Button from "@/src/components/ui/Button/Button";
import Loader from "@/src/components/ui/Loader/Loader";

import { LessonTest, LessonTestQuestion, LessonTestResult } from "@/src/lib/getCourses";

type PropTypes = {
  title: string;
  className?: string;
  description: string;
  isTestLoading: boolean;
  data: LessonTest | null;
  result: LessonTestResult | null;
  review: LessonTestQuestion[] | null;
  onStartTestClick: () => void;
  onSendAnswers: (answers: TestAnswers) => void;
  onNextLessonClick: () => void;
};

export type TestAnswers = Record<number, number[]>;

const Test: FC<PropTypes> = ({
  data,
  title,
  result,
  review,
  className,
  description,
  onSendAnswers,
  isTestLoading,
  onStartTestClick,
  onNextLessonClick,
}) => {
  const [isStarted, setStarted] = useState(false);
  const [isResultsVisible, setResultsVisible] = useState(false);
  const [answers, setAnswers] = useState<TestAnswers>({});
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const handleAnswerChange = useCallback(
    (
      questionId: number,
      answerId: number,
      selectionType: "checkbox" | "radio",
      checked: boolean
    ) => {
      setAnswers((prev) => {
        const selected = prev[questionId] ?? [];
        let next: TestAnswers;

        if (selectionType === "radio") {
          next = checked ? { ...prev, [questionId]: [answerId] } : prev;
        } else {
          const nextSelected = checked
            ? [...selected, answerId]
            : selected.filter((id) => id !== answerId);

          next = { ...prev, [questionId]: nextSelected };
        }

        if ((next[questionId] ?? []).length > 0) {
          setErrors((errorsPrev) => {
            if (!errorsPrev?.[questionId]) return errorsPrev;

            const rest = { ...errorsPrev };
            delete rest[questionId];

            return Object.keys(rest).length ? rest : null;
          });
        }

        return next;
      });
    },
    []
  );

  const validateAnswers = (): boolean => {
    if (!data?.questions.length) return true;

    const nextErrors: Record<string, string> = {};

    for (const question of data.questions) {
      if (!(answers[question.id]?.length ?? 0)) {
        nextErrors[question.id] = "Выберите хотя бы один вариант ответа";
      }
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return false;
    }

    setErrors(null);
    return true;
  };

  const handleClick = () => {
    if (!!result) {
      onNextLessonClick();

      return;
    }

    if (isStarted) {
      if (!validateAnswers()) return;

      onSendAnswers(answers);
    } else {
      setAnswers({});
      setErrors(null);
      setStarted(true);
      onStartTestClick();
    }
  };

  const handleShowResultsClick = () => {
    setResultsVisible(true);
  };

  const questions = useMemo(() => {
    const result: LessonTestQuestion[] = [];

    if (isStarted) {
      result.push(...(data?.questions || []));
    } else {
      result.push(...(review || []));
    }

    return result;
  }, [isStarted, data?.questions, review]);

  console.log(questions, review, data?.questions, isStarted);

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

          {(isStarted || isResultsVisible) && !isTestLoading && (
            <div className="test__content-list">
              {questions?.map((question) => (
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
                  error={errors?.[question.id] ?? null}
                />
              ))}
            </div>
          )}

          {isTestLoading && <Loader isLocal />}

          <Button
            className="test__button"
            variant="main-green-dark"
            onClick={handleClick}
            disabled={isTestLoading}
            withArrow
          >
            {result ? "Следующий урок" : isStarted ? "Завершить тест" : "Начать тест"}
          </Button>

          {!!result && (
            <Button
              disabled={isTestLoading}
              className="test__button"
              variant="outline-green-dark"
              onClick={handleShowResultsClick}
            >
              Результаты теста
            </Button>
          )}
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
