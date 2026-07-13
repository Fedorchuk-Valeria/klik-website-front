"use client";

import classNames from "classnames";
import type { ChangeEvent, ClipboardEvent, CompositionEvent, KeyboardEvent } from "react";
import { forwardRef, useMemo, useState } from "react";

import TextInput from "../TextInput";
import type { DateInputProps } from "./index.type";

import { formatMasked, parsePastedToDigits, sanitizeDigits } from "./dateMask";

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

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  {
    value: valueProp,
    defaultValue,
    placeholder,
    label,
    className,
    onChange,
    onPaste,
    onKeyDown,
    onCompositionEnd: onCompositionEndProp,
    onBeforeInput: onBeforeInputProp,
    inputMode,
    ...rest
  },
  ref
) {
  const maxYear = useMemo(() => new Date().getFullYear(), []);

  const isControlled = valueProp !== undefined;

  const [fallbackDigits, setFallbackDigits] = useState(() =>
    sanitizeDigits(
      String(defaultValue ?? "")
        .replace(/\D/g, "")
        .slice(0, 8),
      maxYear
    )
  );

  const digitsFromControl = sanitizeDigits(
    String(valueProp ?? "")
      .replace(/\D/g, "")
      .slice(0, 8),
    maxYear
  );

  const digits = isControlled ? digitsFromControl : fallbackDigits;
  const masked = formatMasked(digits);

  const emitMasked = (nextDigits: string, inp: HTMLInputElement) => {
    const maskedVal = formatMasked(nextDigits);
    if (!isControlled) {
      setFallbackDigits(nextDigits);
    }
    const snap = inputSnapshot(inp, maskedVal);
    const syntheticChange = {
      target: snap,
      currentTarget: snap,
      persist: () => {},
    } as ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticChange);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const stripped = sanitizeDigits(e.target.value.replace(/\D/g, "").slice(0, 8), maxYear);
    emitMasked(stripped, e.currentTarget);
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    onCompositionEndProp?.(e);
    if (e.defaultPrevented) return;
    const stripped = sanitizeDigits(e.currentTarget.value.replace(/\D/g, "").slice(0, 8), maxYear);
    emitMasked(stripped, e.currentTarget);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const nextDigits = parsePastedToDigits(e.clipboardData?.getData("text/plain") ?? "", maxYear);

    emitMasked(nextDigits, e.currentTarget);

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

  const handleBeforeInput: NonNullable<DateInputProps["onBeforeInput"]> = (event) => {
    onBeforeInputProp?.(event);
    if (event.defaultPrevented) return;

    const src = event as unknown as { inputType?: string; data?: string | null };
    const type = src.inputType ?? "";
    /* Let paste/drop handlers normalize; `\D` in pasted text would wrongly cancel beforeinput */
    if (type === "insertFromPaste" || type === "insertFromDrop") return;
    if (!type.startsWith("insert")) return;

    const data = typeof src.data === "string" ? src.data : "";
    if (data && /\D/u.test(data)) {
      event.preventDefault();
    }
  };

  return (
    <TextInput
      {...rest}
      ref={ref}
      label={label}
      className={classNames("date-input", className)}
      type="text"
      autoComplete="off"
      spellCheck={false}
      inputMode={inputMode ?? "numeric"}
      placeholder={placeholder ?? "ДД.ММ.ГГГГ"}
      value={masked}
      onChange={handleChange}
      onCompositionEnd={handleCompositionEnd}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onBeforeInput={handleBeforeInput}
    />
  );
});

export default DateInput;
