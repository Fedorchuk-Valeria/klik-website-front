"use client";

import classNames from "classnames";
import type {
  ChangeEvent,
  ClipboardEvent,
  CompositionEvent,
  FocusEvent,
  KeyboardEvent,
} from "react";
import { forwardRef, useId, useRef, useState } from "react";

import { CODE_LENGTH, parsePastedToDigits, sanitizeDigits } from "./codeMask";
import type { CodeInputProps } from "./index.type";

const ACCEPT_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

function inputSnapshot(el: HTMLInputElement, value: string): HTMLInputElement {
  return {
    name: el.name,
    id: el.id,
    type: el.type,
    form: el.form ?? null,
    value,
  } as unknown as HTMLInputElement;
}

const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(function CodeInput(
  {
    value: valueProp,
    defaultValue,
    className,
    error,
    onChange,
    onPaste,
    onKeyDown,
    onFocus,
    onBlur,
    onCompositionEnd: onCompositionEndProp,
    onBeforeInput: onBeforeInputProp,
    inputMode,
    id: idProp,
    name,
    disabled,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    autoComplete = "one-time-code",
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const errorId = `${id}-error`;
  const innerRef = useRef<HTMLInputElement>(null);

  const isControlled = valueProp !== undefined;

  const [fallbackDigits, setFallbackDigits] = useState(() =>
    sanitizeDigits(String(defaultValue ?? ""))
  );
  const [isFocused, setIsFocused] = useState(false);

  const digits = isControlled ? sanitizeDigits(String(valueProp ?? "")) : fallbackDigits;

  const setRef = (el: HTMLInputElement | null) => {
    innerRef.current = el;
    if (typeof ref === "function") {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };

  const emitDigits = (nextDigits: string, inp: HTMLInputElement) => {
    if (!isControlled) {
      setFallbackDigits(nextDigits);
    }
    const snap = inputSnapshot(inp, nextDigits);
    const syntheticChange = {
      target: snap,
      currentTarget: snap,
      persist: () => {},
    } as ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticChange);
  };

  const focusInput = () => {
    if (!disabled) {
      innerRef.current?.focus();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextDigits = sanitizeDigits(e.target.value);
    emitDigits(nextDigits, e.currentTarget);
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    onCompositionEndProp?.(e);
    if (e.defaultPrevented) return;
    const nextDigits = sanitizeDigits(e.currentTarget.value);
    emitDigits(nextDigits, e.currentTarget);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const nextDigits = parsePastedToDigits(e.clipboardData?.getData("text/plain") ?? "");
    emitDigits(nextDigits, e.currentTarget);
    onPaste?.(e);
  };

  const handleKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(ev);
    if (ev.defaultPrevented) return;

    if (ACCEPT_KEYS.has(ev.key)) return;

    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;

    if (ev.key.length === 1 && !/\d/.test(ev.key)) {
      ev.preventDefault();
    }
  };

  const handleBeforeInput: NonNullable<CodeInputProps["onBeforeInput"]> = (event) => {
    onBeforeInputProp?.(event);
    if (event.defaultPrevented) return;

    const src = event as unknown as { inputType?: string; data?: string | null };
    const type = src.inputType ?? "";
    if (type === "insertFromPaste" || type === "insertFromDrop") return;
    if (!type.startsWith("insert")) return;

    const data = typeof src.data === "string" ? src.data : "";
    if (data && /\D/u.test(data)) {
      event.preventDefault();
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const activeIndex = Math.min(digits.length, CODE_LENGTH - 1);
  const ariaDescribedBy =
    [ariaDescribedByProp, !!error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={classNames("code-input", className, {
        "code-input--error": !!error,
        "code-input--disabled": disabled,
      })}
    >
      <div className="code-input__cells" onClick={focusInput} role="presentation">
        {Array.from({ length: CODE_LENGTH }, (_, index) => {
          const char = digits[index];
          const isActive = isFocused && index === activeIndex;

          return (
            <div
              key={index}
              className={classNames("code-input__cell", {
                "code-input__cell--filled": !!char,
                "code-input__cell--active": isActive,
              })}
              aria-hidden
            >
              {char ? (
                <span className="code-input__digit">{char}</span>
              ) : (
                <span className="code-input__dash" />
              )}
            </div>
          );
        })}
      </div>

      <input
        {...rest}
        ref={setRef}
        id={id}
        name={name}
        type="text"
        className="code-input__control"
        value={digits}
        disabled={disabled}
        autoComplete={autoComplete}
        spellCheck={false}
        inputMode={inputMode ?? "numeric"}
        maxLength={CODE_LENGTH}
        aria-invalid={!!error ? true : ariaInvalidProp}
        aria-describedby={ariaDescribedBy}
        aria-label="Код подтверждения"
        onChange={handleChange}
        onCompositionEnd={handleCompositionEnd}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onBeforeInput={handleBeforeInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {!!error && (
        <p className="code-input__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default CodeInput;
