import classNames from "classnames";
import { FC, memo } from "react";

type PropTypes = {
  progress: number;
  total: number;
  className?: string;
};

const CourseProgress: FC<PropTypes> = ({ progress, total, className }) => {
  return (
    <div className={classNames("course-tutorial__progress", className)}>
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
  );
};

export default memo(CourseProgress);
