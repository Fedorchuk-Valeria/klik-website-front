import classNames from "classnames";
import { ChangeEvent, FC, memo } from "react";

import { CheckboxPropTypes } from "@/src/components/ui/Checkbox/index.type";

import { VALIDATION_CLASS } from "@/src/utils/constant";

type PropTypes = Omit<CheckboxPropTypes, "variant">;

const Radio: FC<PropTypes> = ({
  error,
  checked,
  onChange,
  className,
  color = "default",
  ...props
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked);
  };

  return (
    <input
      {...props}
      type="radio"
      checked={!!checked}
      onChange={handleChange}
      className={classNames("radio", `radio-color--${color}`, className, {
        [VALIDATION_CLASS]: !!error,
      })}
    />
  );
};

export default memo(Radio);
