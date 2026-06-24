"use client";

import classNames from "classnames";
import type {
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  KeyboardEvent,
  SyntheticEvent,
} from "react";
import { forwardRef, useRef, useState } from "react";

import TextInput from "../TextInput";
import type { PhoneInputProps } from "./index.type";

import {
  caretAfterDigitIndex,
  digitInsertIndexFromCaret,
  editableCaretBounds,
  extractNationalDigits,
  formatMaskedPhone,
  hasPrefixCorruption,
  nationalDigitPositions,
  parsePastedToNationalDigits,
  PHONE_NATIONAL_DIGIT_COUNT,
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

  const digitsRef = useRef(digits);
  digitsRef.current = digits;

  const pendingKeyInsertRef = useRef<string | null>(null);

  const displayValue = resolveDisplayValue(digits, focused);

  const resolvedPlaceholder =
    focused && digits.length === 0 ? (placeholder ?? MASK_PLACEHOLDER) : placeholder;

  const clampCaret = (el: HTMLInputElement) => {
    const { min, max } = editableCaretBounds(digitsRef.current, focused, FOCUS_EMPTY_PREFIX);
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const newStart = Math.min(Math.max(start, min), max);
    const newEnd = Math.min(Math.max(end, min), max);
    if (newStart !== start || newEnd !== end) {
      el.setSelectionRange(newStart, newEnd);
    }
  };

  const scheduleClampCaret = (el: HTMLInputElement) => {
    requestAnimationFrame(() => {
      clampCaret(el);
    });
  };

  const insertDigitsAtCaret = (el: HTMLInputElement | null, text: string) => {
    if (!el) return;

    const typedDigits = text.replace(/\D/g, "");
    if (typedDigits.length === 0) return;

    const currentDigits = digitsRef.current;
    const { min, max } = editableCaretBounds(currentDigits, focused, FOCUS_EMPTY_PREFIX);
    const start = Math.min(Math.max(el.selectionStart ?? 0, min), max);
    const end = Math.min(Math.max(el.selectionEnd ?? 0, min), max);

    let workingDigits = currentDigits;
    let insertAt: number;

    if (start !== end) {
      const masked = formatMaskedPhone(workingDigits);
      const positions = nationalDigitPositions(masked, workingDigits);
      const toRemove = new Set<number>();
      for (let di = 0; di < positions.length; di++) {
        const p = positions[di];
        if (Math.max(start, p) < Math.min(end, p + 1)) {
          toRemove.add(di);
        }
      }
      for (const ri of [...toRemove].sort((a, b) => b - a)) {
        workingDigits = workingDigits.slice(0, ri) + workingDigits.slice(ri + 1);
      }
      insertAt =
        toRemove.size > 0
          ? Math.min(...toRemove)
          : digitInsertIndexFromCaret(
              start,
              formatMaskedPhone(workingDigits),
              workingDigits,
              FOCUS_EMPTY_PREFIX.length
            );
    } else {
      insertAt = digitInsertIndexFromCaret(
        start,
        formatMaskedPhone(workingDigits),
        workingDigits,
        FOCUS_EMPTY_PREFIX.length
      );
    }

    let nextDigits = workingDigits;
    let insertedCount = 0;
    for (const ch of typedDigits) {
      if (nextDigits.length >= PHONE_NATIONAL_DIGIT_COUNT) break;
      nextDigits =
        nextDigits.slice(0, insertAt + insertedCount) +
        ch +
        nextDigits.slice(insertAt + insertedCount);
      insertedCount++;
    }

    if (insertedCount === 0) return;

    emitMasked(nextDigits, el);

    const newMasked = formatMaskedPhone(nextDigits);
    const lastInsertedIndex = insertAt + insertedCount - 1;
    const caret = caretAfterDigitIndex(
      newMasked,
      nextDigits,
      lastInsertedIndex,
      FOCUS_EMPTY_PREFIX.length,
      focused
    );

    requestAnimationFrame(() => {
      el.setSelectionRange(caret, caret);
    });
  };

  const emitMasked = (
    nextDigits: string,
    inp: HTMLInputElement,
    base?: ChangeEvent<HTMLInputElement>
  ) => {
    digitsRef.current = nextDigits;
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
    if (hasPrefixCorruption(e.target.value)) {
      scheduleClampCaret(e.currentTarget);
      return;
    }

    const next = extractNationalDigits(e.target.value);
    if (next.length === 0 && digits.length === 0) {
      scheduleClampCaret(e.currentTarget);
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
    let nextDigits = digitsRef.current;
    for (let i = sortedAsc.length - 1; i >= 0; i--) {
      const ri = sortedAsc[i];
      nextDigits = nextDigits.slice(0, ri) + nextDigits.slice(ri + 1);
    }
    emitMasked(nextDigits, el);

    const newMasked = formatMaskedPhone(nextDigits);
    const renderedValue = resolveDisplayValue(nextDigits, focused);
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
      const c = Math.min(Math.max(0, caret), renderedValue.length);
      el?.setSelectionRange(c, c);
    });
  };

  const handleKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(ev);
    if (ev.defaultPrevented) return;

    if (ev.key === "Backspace" || ev.key === "Delete") {
      const el = ev.currentTarget;

      if (digitsRef.current.length === 0 && focused) {
        ev.preventDefault();
        requestAnimationFrame(() => {
          const caret = FOCUS_EMPTY_PREFIX.length;
          el?.setSelectionRange(caret, caret);
        });
        return;
      }

      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const masked = formatMaskedPhone(digitsRef.current);
      const positions = nationalDigitPositions(masked, digitsRef.current);

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

    if (ev.key === "Home") {
      ev.preventDefault();
      const { min } = editableCaretBounds(digitsRef.current, focused, FOCUS_EMPTY_PREFIX);
      ev.currentTarget.setSelectionRange(min, min);
      return;
    }

    if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") {
      scheduleClampCaret(ev.currentTarget);
      return;
    }

    if (ACCEPT_KEYS.has(ev.key)) return;

    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;

    if (ev.key.length === 1 && /\d/.test(ev.key)) {
      ev.preventDefault();
      const inputEl = ev.currentTarget;
      const digit = ev.key;
      pendingKeyInsertRef.current = digit;
      queueMicrotask(() => {
        if (pendingKeyInsertRef.current === null) return;
        insertDigitsAtCaret(inputEl, pendingKeyInsertRef.current);
        pendingKeyInsertRef.current = null;
      });
      return;
    }

    if (ev.key.length === 1 && !/\d/.test(ev.key)) {
      ev.preventDefault();
    }
  };

  const handleBeforeInput: NonNullable<PhoneInputProps["onBeforeInput"]> = (event) => {
    onBeforeInputProp?.(event);
    if (event.defaultPrevented) return;

    const src = event as unknown as { inputType?: string; data?: string | null };
    const type = src.inputType ?? "";
    if (type === "insertFromPaste" || type === "insertFromDrop") return;
    if (!type.startsWith("insert")) return;

    const data = typeof src.data === "string" ? src.data : "";
    if (!data) return;

    if (/\D/u.test(data)) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    pendingKeyInsertRef.current = null;
    insertDigitsAtCaret(event.currentTarget as HTMLInputElement, data);
  };

  const handleCaretGuard = (e: SyntheticEvent<HTMLInputElement>) => {
    scheduleClampCaret(e.currentTarget);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);

    if (digits.length === 0) {
      const caret = FOCUS_EMPTY_PREFIX.length;
      requestAnimationFrame(() => {
        e?.currentTarget?.setSelectionRange(caret, caret);
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
      onClick={handleCaretGuard}
      onSelect={handleCaretGuard}
      onBeforeInput={handleBeforeInput}
    />
  );
});

export default PhoneInput;
