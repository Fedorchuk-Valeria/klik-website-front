"use client";

import classNames from "classnames";
import { FC, memo, SyntheticEvent, useMemo, useState } from "react";

import { CheckboxPropTypes } from "./index.type";

const Checkbox: FC<CheckboxPropTypes> = ({ id, error, checked, onChange, className, ...props }) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(false);

  const isChecked = useMemo(
    () => (isControlled ? !!checked : internalChecked),
    [isControlled, checked, internalChecked]
  );

  const handleChange = (event: SyntheticEvent) => {
    const check = (event.target as HTMLInputElement).checked;

    if (onChange) onChange(check);

    if (!isControlled) setInternalChecked(check);
  };

  return (
    <input
      {...props}
      type="checkbox"
      checked={isChecked}
      onChange={handleChange}
      className={classNames("checkbox", className, {
        VALIDATION_CLASS: !!error,
      })}
    />
  );
};

export default memo(Checkbox);
