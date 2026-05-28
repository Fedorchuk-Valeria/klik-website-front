import classNames from "classnames";
import { FC, memo } from "react";

type PropTypes = {
  isLocal?: boolean;
};

const Loader: FC<PropTypes> = ({ isLocal = false }) => {
  return (
    <div className={classNames("loader", { "loader--local": isLocal })}>
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
