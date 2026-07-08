import classNames from "classnames";
import { FC, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import TextInput, { TextInputProps } from "@/src/components/ui/TextInput";

type PropTypes = TextInputProps;

const PasswordInput: FC<PropTypes> = ({ className, ...props }) => {
  const [isShowPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      {...props}
      className={classNames("password-input", className)}
      type={isShowPassword ? "text" : "password"}
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
