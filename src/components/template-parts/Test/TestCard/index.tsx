import classNames from "classnames";
import { FC } from "react";

import Badge from "@/src/components/ui/Badge";
import Checkbox from "@/src/components/ui/Checkbox";
import Icon from "@/src/components/ui/Icon/Icon";
import Radio from "@/src/components/ui/Radio";

import { LessonTestAnswer } from "@/src/lib/getCourses";

type PropTypes = {
  id: number | string;
  questionId: number;
  title: string;
  description: string;
  className?: string;
  selectionType: "checkbox" | "radio";
  selectedAnswerIds: number[];
  onAnswerChange: (answerId: number, checked: boolean) => void;
  answers: LessonTestAnswer[];
  error: string | null;
  disabled: boolean;
  isTestPassed?: boolean;
  isCorrect?: boolean;
};

const TestCard: FC<PropTypes> = ({
  id,
  isTestPassed,
  isCorrect,
  questionId,
  title,
  description,
  className,
  answers,
  selectionType,
  selectedAnswerIds,
  onAnswerChange,
  error,
  disabled,
}) => {
  const isCorrectAnswer = typeof isCorrect === "boolean" && isCorrect;
  const isIncorrectAnswer = typeof isCorrectAnswer === "boolean" && !isCorrectAnswer;

  return (
    <div
      className={classNames("test-card", className, {
        "test-card--error": !!error,
      })}
    >
      <div className="test-card__header">
        <Badge className="test-card__badge" title={`Вопрос ${id}`} />

        {(isCorrectAnswer || isIncorrectAnswer) && isTestPassed && (
          <p
            className={classNames("test-card__result", {
              "test-card__result--correct": isCorrectAnswer,
              "test-card__result--incorrect": isIncorrectAnswer,
            })}
          >
            <Icon name={isCorrectAnswer ? "success-circle" : "error-circle"} />
            <span>{isCorrectAnswer ? "Верно" : "Не верно"}</span>
          </p>
        )}
      </div>

      <p className="test-card__description">{description}</p>
      <p className="test-card__title">{title}</p>
      <p className="test-card__error">{error}</p>

      <ul className="test-card__answers">
        {answers.map((answer) => {
          const isSelected = selectedAnswerIds.includes(answer.id);
          const isAnswerCorrect = answer?.is_correct_answer;
          const isAnswerIncorrect =
            answer?.is_selected && answer?.is_selected !== answer?.is_correct_answer;

          return (
            <li key={answer.id}>
              <label
                className={classNames("test-card__answer", {
                  "test-card__answer--correct": isAnswerCorrect,
                  "test-card__answer--incorrect": isAnswerIncorrect,
                  "test-card__answer--disabled": disabled,
                })}
              >
                {selectionType === "checkbox" ? (
                  <Checkbox
                    value={answer.id}
                    variant="test"
                    color={isTestPassed ? (isAnswerIncorrect ? "red" : "green") : "default"}
                    checked={isSelected || (disabled && isAnswerCorrect)}
                    disabled={disabled}
                    onChange={(checked) => onAnswerChange(answer.id, checked)}
                  />
                ) : (
                  <Radio
                    name={
                      isTestPassed
                        ? `test-question-${questionId}-${answer.id}`
                        : `test-question-${questionId}`
                    }
                    value={answer.id}
                    checked={isSelected || (disabled && isAnswerCorrect)}
                    disabled={disabled}
                    color={isTestPassed ? (isAnswerIncorrect ? "red" : "green") : "default"}
                    onChange={(checked) => onAnswerChange(answer.id, checked)}
                  />
                )}
                <span>{answer.text}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TestCard;
