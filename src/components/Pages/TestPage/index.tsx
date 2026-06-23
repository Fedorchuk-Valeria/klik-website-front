"use client";

import { FC, useEffect, useState } from "react";

import { LessonTestFetchResult } from "@/src/lib/getCourses";

import { TestAnswers } from "@/src/components/template-parts/Test";
import TestCard from "@/src/components/template-parts/Test/TestCard";
import Icon from "@/src/components/ui/Icon/Icon";

type PropTypes = {
  data: LessonTestFetchResult["data"] | null;
};

const TestPageComponent: FC<PropTypes> = ({ data }) => {
  const [answers, setAnswers] = useState<TestAnswers>({});

  useEffect(() => {
    if (data?.review) {
      const nextAnswers: TestAnswers = {};

      for (const question of data?.review) {
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
  }, [data?.review]);

  return (
    <div className="test-page">
      <div className="platform-layout__container">
        <div className="test-page__back">
          <Icon name="arrow" />
          <span>Вернуться к просмотру курсов</span>
        </div>

        <div className="test test--started">
          <div className="test__content">
            <div className="test__content-info">
              <p className="test__content-title">Результаты теста</p>

              <div className="test__content-list">
                {data?.review?.map((question) => (
                  <TestCard
                    key={question.id}
                    isTestPassed={true}
                    isCorrect={question.is_correct}
                    id={question.number < 10 ? `0${question.number}` : question.number}
                    questionId={question.id}
                    title={question.text}
                    description={""}
                    answers={question.answers}
                    selectionType={question.selection_type}
                    selectedAnswerIds={answers[question.id] ?? []}
                    disabled={true}
                    error={null}
                    onAnswerChange={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPageComponent;
