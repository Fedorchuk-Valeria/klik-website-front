import classNames from "classnames";
import { FC } from "react";

import Badge from "@/src/components/ui/Badge";
import Checkbox from "@/src/components/ui/Checkbox";
import Radio from "@/src/components/ui/Radio";

type PropTypes = {
  id: number | string;
  questionId: number;
  title: string;
  description: string;
  className?: string;
  selectionType: "checkbox" | "radio";
  selectedAnswerIds: number[];
  onAnswerChange: (answerId: number, checked: boolean) => void;
  answers: {
    id: number;
    text: string;
  }[];
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
}) => {
  return (
    <div className={classNames("test-card", className)}>
      <Badge className="test-card__badge" title={`Вопрос ${id}`} />
      <p className="test-card__description">{description}</p>
      <p className="test-card__title">{title}</p>

      <ul className="test-card__answers">
        {answers.map((answer) => {
          const isSelected = selectedAnswerIds.includes(answer.id);

          return (
            <li key={answer.id}>
              <label className="test-card__answer">
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
