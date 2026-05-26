"use client";

import classNames from "classnames";
import type { ChangeEvent, ClipboardEvent, FocusEvent, KeyboardEvent } from "react";
import { forwardRef, useState } from "react";

import TextInput from "../TextInput";
import type { PhoneInputProps } from "./index.type";

import {
  extractNationalDigits,
  formatMaskedPhone,
  nationalDigitPositions,
  parsePastedToNationalDigits,
} from "./phoneMask";

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

const MASK_PLACEHOLDER = "+375 (XX) XXX XX XX";
const FOCUS_EMPTY_PREFIX = "+375";

function resolveDisplayValue(digits: string, focused: boolean): string {
  if (digits.length === 0) {
    return focused ? FOCUS_EMPTY_PREFIX : "";
  }
  return formatMaskedPhone(digits);
}

function inputSnapshot(el: HTMLInputElement, value: string): HTMLInputElement {
  return {
    name: el.name,
    id: el.id,
    type: el.type,
    form: el.form ?? null,
    value,
  } as unknown as HTMLInputElement;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  {
    value: valueProp,
    defaultValue,
    placeholder,
    label,
    className,
    onChange,
    onPaste,
    onKeyDown,
    onFocus,
    onBlur,
    onBeforeInput: onBeforeInputProp,
    inputMode,
    ...rest
  },
  ref
) {
  const isControlled = valueProp !== undefined;

  const [focused, setFocused] = useState(false);

  const [fallbackDigits, setFallbackDigits] = useState(() =>
    extractNationalDigits(String(defaultValue ?? ""))
  );

  const digitsFromControl = extractNationalDigits(String(valueProp ?? ""));

  const digits = isControlled ? digitsFromControl : fallbackDigits;

  const displayValue = resolveDisplayValue(digits, focused);

  const resolvedPlaceholder =
    focused && digits.length === 0 ? (placeholder ?? MASK_PLACEHOLDER) : placeholder;

  const emitMasked = (
    nextDigits: string,
    inp: HTMLInputElement,
    base?: ChangeEvent<HTMLInputElement>
  ) => {
    const maskedVal = formatMaskedPhone(nextDigits);
    if (!isControlled) {
      setFallbackDigits(nextDigits);
    }
    const snap = inputSnapshot(inp, maskedVal);
    if (base) {
      onChange?.({ ...base, target: snap, currentTarget: snap } as ChangeEvent<HTMLInputElement>);
    } else {
      onChange?.({
        target: snap,
        currentTarget: snap,
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = extractNationalDigits(e.target.value);
    if (next.length === 0 && digits.length === 0) {
      return;
    }
    emitMasked(next, e.currentTarget, e);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const nextDigits = parsePastedToNationalDigits(e.clipboardData?.getData("text/plain") ?? "");
    emitMasked(nextDigits, e.currentTarget);
    onPaste?.(e);
  };

  const applyDigitRemovalAndCaret = (
    el: HTMLInputElement,
    indicesToRemove: Set<number>,
    caretHint: number
  ) => {
    if (indicesToRemove.size === 0) return;

    const sortedAsc = [...indicesToRemove].sort((a, b) => a - b);
    let nextDigits = digits;
    for (let i = sortedAsc.length - 1; i >= 0; i--) {
      const ri = sortedAsc[i];
      nextDigits = nextDigits.slice(0, ri) + nextDigits.slice(ri + 1);
    }
    emitMasked(nextDigits, el);

    const newMasked = formatMaskedPhone(nextDigits);
    const newPositions = nationalDigitPositions(newMasked, nextDigits);

    let caret: number;
    if (newPositions.length === 0) {
      caret = focused ? FOCUS_EMPTY_PREFIX.length : 0;
    } else if (sortedAsc.length > 1) {
      caret = Math.min(caretHint, newMasked.length);
    } else {
      const ri = sortedAsc[0];
      caret = ri > 0 ? newPositions[ri - 1] + 1 : newPositions[0];
    }

    requestAnimationFrame(() => {
      const c = Math.min(Math.max(0, caret), newMasked.length);
      el.setSelectionRange(c, c);
    });
  };

  const handleKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(ev);
    if (ev.defaultPrevented) return;

    if (ev.key === "Backspace" || ev.key === "Delete") {
      const el = ev.currentTarget;

      if (digits.length === 0 && focused) {
        ev.preventDefault();
        requestAnimationFrame(() => {
          const caret = FOCUS_EMPTY_PREFIX.length;
          el.setSelectionRange(caret, caret);
        });
        return;
      }

      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const masked = formatMaskedPhone(digits);
      const positions = nationalDigitPositions(masked, digits);

      if (start !== end) {
        const toRemove = new Set<number>();
        for (let di = 0; di < positions.length; di++) {
          const p = positions[di];
          const a = Math.max(start, p);
          const b = Math.min(end, p + 1);
          if (a < b) toRemove.add(di);
        }
        if (toRemove.size > 0) {
          ev.preventDefault();
          applyDigitRemovalAndCaret(el, toRemove, start);
        }
        return;
      }

      if (ev.key === "Backspace") {
        if (start === 0) return;

        let removeIndex = -1;
        const atDigit = positions.indexOf(start);
        if (atDigit !== -1) {
          removeIndex = atDigit;
        } else {
          for (let i = positions.length - 1; i >= 0; i--) {
            if (positions[i] < start) {
              removeIndex = i;
              break;
            }
          }
        }

        if (removeIndex !== -1) {
          ev.preventDefault();
          applyDigitRemovalAndCaret(el, new Set([removeIndex]), start);
        }
        return;
      }

      /* Delete (forward) */
      let removeIndex = -1;
      const at = positions.indexOf(start);
      if (at !== -1) {
        removeIndex = at;
      } else {
        for (let i = 0; i < positions.length; i++) {
          if (positions[i] > start) {
            removeIndex = i;
            break;
          }
        }
      }
      if (removeIndex !== -1) {
        ev.preventDefault();
        applyDigitRemovalAndCaret(el, new Set([removeIndex]), start);
      }
      return;
    }

    if (ACCEPT_KEYS.has(ev.key)) return;

    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;

    if (ev.key.length === 1 && !/\d/.test(ev.key)) {
      ev.preventDefault();
    }
  };

  const handleBeforeInput: NonNullable<PhoneInputProps["onBeforeInput"]> = (event) => {
    onBeforeInputProp?.(event);
    if (event.defaultPrevented) return;

    const src = event as unknown as { inputType?: string; data?: string | null };
    const type = src.inputType ?? "";
    if (!type.startsWith("insert")) return;

    const data = typeof src.data === "string" ? src.data : "";
    if (data && /\D/u.test(data)) {
      event.preventDefault();
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);

    if (digits.length === 0) {
      const caret = FOCUS_EMPTY_PREFIX.length;
      requestAnimationFrame(() => {
        e.currentTarget.setSelectionRange(caret, caret);
      });
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <TextInput
      {...rest}
      ref={ref}
      label={label}
      className={classNames("phone-input", className)}
      type="text"
      autoComplete="tel"
      spellCheck={false}
      inputMode={inputMode ?? "tel"}
      placeholder={resolvedPlaceholder}
      value={displayValue}
      onChange={handleChange}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onBeforeInput={handleBeforeInput}
    />
  );
});

export default PhoneInput;
