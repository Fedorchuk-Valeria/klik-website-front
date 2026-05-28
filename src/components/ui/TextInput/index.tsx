import classNames from "classnames";
import { ComponentPropsWithoutRef, forwardRef, ReactNode, useId } from "react";

export type TextInputProps = {
  label: ReactNode;
  error?: string | boolean;
  addonAfter?: React.ReactNode;
  variant?: "outline" | "filled";
} & ComponentPropsWithoutRef<"input">;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    label,
    error,
    addonAfter,
    className,
    id: idProp,
    required,
    type = "text",
    variant = "filled",
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    ...inputProps
  },
  ref
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const errorId = `${id}-error`;
  const rawValue = inputProps.value;
  const isFilled = rawValue !== undefined && rawValue !== null && String(rawValue).length > 0;

  const ariaDescribedBy =
    [ariaDescribedByProp, !!error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={classNames("text-input", className, {
        "text-input--error": !!error,
        "text-input--outline": variant === "outline",
        "text-input--filled": variant === "filled",
      })}
    >
      {label ? <label className="text-input__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="text-input__required" aria-hidden>
              {" "}
            *
            </span>
        ) : null}
      </label> : null}
      <div className="text-input__control-wrapper">
        <input
          ref={ref}
          {...inputProps}
          id={id}
          type={type}
          className={classNames("text-input__control", {
            "text-input__control--filled": isFilled && !error,
            "text-input__control--addon-after": !!addonAfter,
          })}
          aria-invalid={!!error ? true : ariaInvalidProp}
          aria-describedby={ariaDescribedBy}
        />

        {!!addonAfter && <div className="text-input__icon">{addonAfter}</div>}
      </div>

      {!!error && (
        <p className="text-input__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default TextInput;
