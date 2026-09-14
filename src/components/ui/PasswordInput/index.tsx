import classNames from "classnames";
import { ChangeEvent, FC, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import TextInput, { TextInputProps } from "@/src/components/ui/TextInput";
import {
  getPasswordLatinOnlyError,
  normalizePasswordInput,
} from "@/src/utils/helpers/passwordInput";

type PropTypes = TextInputProps;

const PasswordInput: FC<PropTypes> = ({ className, onChange, error, value, ...props }) => {
  const [isShowPassword, setShowPassword] = useState(false);
  const latinOnlyError = getPasswordLatinOnlyError(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value: nextValue } = event.target;
    const { value: normalized } = normalizePasswordInput(nextValue);

    onChange?.({
      ...event,
      target: { ...event.target, name, value: normalized },
    });
  };

  return (
    <TextInput
      {...props}
      value={value}
      error={latinOnlyError ?? error}
      className={classNames("password-input", className)}
      type={isShowPassword ? "text" : "password"}
      onChange={handleChange}
      addonAfter={
        <span
          className={classNames("password-input__icon", {
            "password-input__icon--disabled": props?.disabled,
          })}
          onClick={() => setShowPassword(!isShowPassword)}
        >
          <Icon name={isShowPassword ? "eye" : "eye-closed"} />
        </span>
      }
    />
  );
};

export default PasswordInput;
