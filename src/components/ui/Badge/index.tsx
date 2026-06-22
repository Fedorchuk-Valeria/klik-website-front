import classNames from "classnames";
import { FC, memo } from "react";

type PropTypes = {
  className?: string;
  title: string;
};

const Badge: FC<PropTypes> = ({ className, title }) => {
  return <div className={classNames("badge", className)}>{title}</div>;
};

export default memo(Badge);
