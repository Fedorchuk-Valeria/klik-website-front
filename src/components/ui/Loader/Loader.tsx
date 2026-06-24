import classNames from "classnames";
import { FC, memo } from "react";

type PropTypes = {
  isLocal?: boolean;
  className?: string;
};

const Loader: FC<PropTypes> = ({ isLocal = false, className }) => {
  return (
    <div className={classNames("loader", { "loader--local": isLocal }, className)}>
      <div className="loader__content">
        <div className="loader__spinner">
          <span />
          <span />
          <span />
        </div>

        <p className="loader__text">Загрузка ...</p>
      </div>
    </div>
  );
};

export default memo(Loader);
