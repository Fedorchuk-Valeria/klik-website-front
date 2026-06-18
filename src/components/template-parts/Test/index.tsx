"use client";

import classNames from "classnames";
import Image from "next/image";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import TestSVG from "@/src/assets/images/test.svg";
import testImage from "@/src/assets/images/view/courses/test.png";

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
  isTestPassed?: boolean;
  onReviewClick: () => void;
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
  isTestPassed,
  onReviewClick,
  onSendAnswers,
  isTestLoading,
  onStartTestClick,
  onNextLessonClick,
}) => {
  const testRef = useRef<HTMLDivElement>(null);
  const contentListRef = useRef<HTMLDivElement>(null);
  const shouldScrollToErrorRef = useRef(false);
  const shouldScrollToTestRef = useRef(false);
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
    if (isTestPassed) {
      onNextLessonClick();

      return;
    }

    if (isStarted) {
      if (!validateAnswers()) {
        shouldScrollToErrorRef.current = true;

        return;
      }

      shouldScrollToTestRef.current = true;
      onSendAnswers(answers);
      setStarted(false);
      setResultsVisible(false);
    } else {
      setAnswers({});
      setErrors(null);
      setStarted(true);
      onStartTestClick();
    }
  };

  const handleShowResultsClick = () => {
    setResultsVisible(true);
    onReviewClick();
  };

  const questions = useMemo(() => {
    const result: LessonTestQuestion[] = [];

    if (!isTestPassed && isStarted) {
      result.push(...(data?.questions || []));
    } else {
      result.push(...(review || []));
    }

    return result;
  }, [isStarted, isTestPassed, data?.questions, review]);

  useEffect(() => {
    if (!!review) {
      const nextAnswers: TestAnswers = {};

      for (const question of review) {
        nextAnswers[question.id] = question.answers
          .map((answer) => {
            if (answer.is_selected) {
              return answer.id;
            } else {
              return null;
            }
          })
          .filter((answer) => answer !== null);
      }

      queueMicrotask(() => {
        setAnswers(nextAnswers);
      });
    }
  }, [review]);

  useEffect(() => {
    if (!shouldScrollToErrorRef.current || !errors || !contentListRef.current) return;

    shouldScrollToErrorRef.current = false;

    const firstErrorCard = contentListRef.current.querySelector(".test-card--error");

    firstErrorCard?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [errors]);

  useEffect(() => {
    if (!shouldScrollToTestRef.current || isTestLoading) return;

    shouldScrollToTestRef.current = false;

    if (!result) return;

    testRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result, isTestLoading]);

  return (
    <div
      ref={testRef}
      className={classNames("test", className, {
        "test--started": isStarted || isResultsVisible,
      })}
    >
      <span className="test__icon">
        <TestSVG />
      </span>

      <div className="test__content">
        <div className="test__content-info">
          <p className="test__content-title">{!isResultsVisible ? title : "Результаты теста"}</p>
          {!isResultsVisible && <p className="test__content-description">{description}</p>}

          {(isStarted || isResultsVisible) && !isTestLoading && (
            <div className="test__content-list" ref={contentListRef}>
              {questions?.map((question) => (
                <TestCard
                  key={question.id}
                  isTestPassed={isTestPassed}
                  isCorrect={question.is_correct}
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
                  disabled={isResultsVisible}
                />
              ))}
            </div>
          )}

          {isTestLoading && <Loader isLocal />}

          {!isResultsVisible && (
            <Button
              className="test__button test__button--next"
              variant="main-green-dark"
              onClick={handleClick}
              disabled={isTestLoading}
              withArrow
            >
              {result ? "Следующий урок" : isStarted ? "Завершить тест" : "Начать тест"}
            </Button>
          )}

          {!!result && !isResultsVisible && (
            <Button
              disabled={isTestLoading}
              className="test__button test__button--results"
              variant="outline-green-dark"
              onClick={handleShowResultsClick}
            >
              Результаты теста
            </Button>
          )}
        </div>

        <div className="test__image">
          <Image fill alt={title} src={testImage} sizes="(max-width: 768px) 100vw, 640px" />
        </div>
      </div>
    </div>
  );
};

export default Test;
