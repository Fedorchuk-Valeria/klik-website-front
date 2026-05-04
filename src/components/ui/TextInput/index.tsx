import classNames from "classnames";
import { ComponentPropsWithoutRef, forwardRef, useId } from "react";

export type TextInputProps = {
  label: string;
  error?: string | boolean;
} & ComponentPropsWithoutRef<"input">;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    label,
    error,
    className,
    id: idProp,
    required,
    type = "text",
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
      className={classNames("text-input", {
        "text-input--error": !!error,
      })}
    >
      <label className="text-input__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="text-input__required" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>

      <input
        ref={ref}
        {...inputProps}
        id={id}
        type={type}
        className={classNames(
          "text-input__control",
          isFilled && !error && "text-input__control--filled",
          className
        )}
        aria-invalid={!!error ? true : ariaInvalidProp}
        aria-describedby={ariaDescribedBy}
        required={required}
      />

      {!!error && (
        <p className="text-input__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default TextInput;
