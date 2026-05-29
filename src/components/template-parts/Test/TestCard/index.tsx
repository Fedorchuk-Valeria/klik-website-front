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
};

const TestCard: FC<PropTypes> = ({
  id,
  questionId,
  title,
  description,
  className,
  answers,
  selectionType,
  selectedAnswerIds,
  onAnswerChange,
  error,
}) => {
  const isCorrectAnswer = answers.some(
    (answer) =>
      typeof answer.is_correct_answer === "boolean" &&
      answer.is_correct_answer === answer.is_selected
  );
  const isIncorrectAnswer = answers.some(
    (answer) => !!answer.is_selected && answer.is_selected !== answer.is_correct_answer
  );

  return (
    <div className={classNames("test-card", className)}>
      <div className="test-card__header">
        <Badge className="test-card__badge" title={`Вопрос ${id}`} />

        {(isCorrectAnswer || isIncorrectAnswer) && (
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

          return (
            <li key={answer.id}>
              <label
                className={classNames("test-card__answer", {
                  "test-card__answer--correct": answer?.is_correct_answer,
                  "test-card__answer--incorrect":
                    answer?.is_selected && answer?.is_selected !== answer?.is_correct_answer,
                })}
              >
                {selectionType === "checkbox" ? (
                  <Checkbox
                    value={answer.id}
                    variant="test"
                    checked={isSelected}
                    onChange={(checked) => onAnswerChange(answer.id, checked)}
                  />
                ) : (
                  <Radio
                    name={`test-question-${questionId}`}
                    value={answer.id}
                    checked={isSelected}
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
