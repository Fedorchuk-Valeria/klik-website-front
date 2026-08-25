"use client";

import classNames from "classnames";
import type { CountryCode } from "libphonenumber-js";
import type { ChangeEvent, ClipboardEvent, FocusEvent, KeyboardEvent, SyntheticEvent } from "react";
import { forwardRef, useId, useRef, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import useClickOutside from "@/src/hooks/useClickOutside";

import CountryFlag from "./CountryFlag";
import type { PhoneInputProps } from "./index.type";
import {
  DEFAULT_PHONE_COUNTRIES,
  DEFAULT_PHONE_COUNTRY,
  formatCountryOptionLabel,
  getPhoneCountry,
  type PhoneCountry,
} from "./phoneCountries";
import {
  caretAfterDigitIndex,
  digitInsertIndexFromCaret,
  editableCaretBounds,
  extractNationalDigits,
  formatDisplayPhone,
  getCallingCodePrefix,
  getExamplePlaceholder,
  getMaxNationalDigits,
  nationalDigitPositions,
  nationalDigitsFromE164,
  parsePastedNationalDigits,
  resolveCountryFromE164,
  toE164,
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

function resolveDisplayValue(digits: string, focused: boolean, country: CountryCode): string {
  if (digits.length === 0) {
    return focused ? getCallingCodePrefix(country) : "";
  }
  return formatDisplayPhone(digits, country);
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
    label,
    error,
    className,
    required,
    id: idProp,
    defaultCountry = DEFAULT_PHONE_COUNTRY,
    countries = DEFAULT_PHONE_COUNTRIES,
    onChange,
    onPaste,
    onKeyDown,
    onFocus,
    onBlur,
    onBeforeInput: onBeforeInputProp,
    inputMode,
    disabled,
    name,
    variant = "filled",
    isAbsoluteError = false,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const errorId = `${id}-error`;
  const listboxId = `${id}-countries`;

  const isControlled = valueProp !== undefined;
  const allowedCodes = countries.map((c) => c.code);

  const [focused, setFocused] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState<CountryCode>(() => {
    const initial = String(valueProp ?? defaultValue ?? "");
    if (initial) {
      return resolveCountryFromE164(initial, defaultCountry, allowedCodes);
    }
    return defaultCountry;
  });

  const [fallbackDigits, setFallbackDigits] = useState(() =>
    nationalDigitsFromE164(String(defaultValue ?? ""), defaultCountry)
  );

  const digitsFromControl = nationalDigitsFromE164(String(valueProp ?? ""), country);
  const digits = isControlled ? digitsFromControl : fallbackDigits;

  const digitsRef = useRef(digits);
  digitsRef.current = digits;
  const countryRef = useRef(country);
  countryRef.current = country;
  const pendingKeyInsertRef = useRef<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayValue = resolveDisplayValue(digits, focused, country);
  const resolvedPlaceholder =
    !focused && digits.length === 0 ? getExamplePlaceholder(country) : undefined;

  const selectedCountry: PhoneCountry = getPhoneCountry(country, countries) ??
    countries[0] ?? { code: "BY", name: "Беларусь" };

  useClickOutside(rootRef, () => setCountryOpen(false));

  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const clampCaret = (el: HTMLInputElement) => {
    const { min, max } = editableCaretBounds(
      digitsRef.current,
      focused,
      getCallingCodePrefix(countryRef.current),
      countryRef.current
    );
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

  const emitE164 = (
    nextDigits: string,
    inp: HTMLInputElement,
    nextCountry: CountryCode = countryRef.current,
    base?: ChangeEvent<HTMLInputElement>
  ) => {
    digitsRef.current = nextDigits;
    if (!isControlled) {
      setFallbackDigits(nextDigits);
    }
    const e164 = toE164(nextDigits, nextCountry);
    const snap = inputSnapshot(inp, e164);
    if (base) {
      onChange?.({ ...base, target: snap, currentTarget: snap } as ChangeEvent<HTMLInputElement>);
    } else {
      onChange?.({
        target: snap,
        currentTarget: snap,
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  const insertDigitsAtCaret = (el: HTMLInputElement | null, text: string) => {
    if (!el) return;

    const typedDigits = text.replace(/\D/g, "");
    if (typedDigits.length === 0) return;

    const currentCountry = countryRef.current;
    const max = getMaxNationalDigits(currentCountry);
    const currentDigits = digitsRef.current;
    const currentPrefix = getCallingCodePrefix(currentCountry);
    const { min, max: caretMax } = editableCaretBounds(
      currentDigits,
      focused,
      currentPrefix,
      currentCountry
    );
    const start = Math.min(Math.max(el.selectionStart ?? 0, min), caretMax);
    const end = Math.min(Math.max(el.selectionEnd ?? 0, min), caretMax);

    let workingDigits = currentDigits;
    let insertAt: number;

    if (start !== end) {
      const masked = formatDisplayPhone(workingDigits, currentCountry);
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
              formatDisplayPhone(workingDigits, currentCountry),
              workingDigits,
              currentPrefix.length
            );
    } else {
      insertAt = digitInsertIndexFromCaret(
        start,
        formatDisplayPhone(workingDigits, currentCountry),
        workingDigits,
        currentPrefix.length
      );
    }

    let nextDigits = workingDigits;
    let insertedCount = 0;
    for (const ch of typedDigits) {
      if (nextDigits.length >= max) break;
      nextDigits =
        nextDigits.slice(0, insertAt + insertedCount) +
        ch +
        nextDigits.slice(insertAt + insertedCount);
      insertedCount++;
    }

    if (insertedCount === 0) return;

    emitE164(nextDigits, el, currentCountry);

    const newMasked = formatDisplayPhone(nextDigits, currentCountry);
    const lastInsertedIndex = insertAt + insertedCount - 1;
    const caret = caretAfterDigitIndex(
      newMasked,
      nextDigits,
      lastInsertedIndex,
      currentPrefix.length,
      focused
    );

    requestAnimationFrame(() => {
      el.setSelectionRange(caret, caret);
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentCountry = countryRef.current;
    const next = extractNationalDigits(e.target.value, currentCountry);
    if (next.length === 0 && digits.length === 0) {
      scheduleClampCaret(e.currentTarget);
      return;
    }
    emitE164(next, e.currentTarget, currentCountry, e);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const nextDigits = parsePastedNationalDigits(
      e.clipboardData?.getData("text/plain") ?? "",
      countryRef.current
    );
    emitE164(nextDigits, e.currentTarget);
    onPaste?.(e);
  };

  const applyDigitRemovalAndCaret = (
    el: HTMLInputElement,
    indicesToRemove: Set<number>,
    caretHint: number
  ) => {
    if (indicesToRemove.size === 0) return;

    const currentCountry = countryRef.current;
    const currentPrefix = getCallingCodePrefix(currentCountry);
    const sortedAsc = [...indicesToRemove].sort((a, b) => a - b);
    let nextDigits = digitsRef.current;
    for (let i = sortedAsc.length - 1; i >= 0; i--) {
      const ri = sortedAsc[i];
      nextDigits = nextDigits.slice(0, ri) + nextDigits.slice(ri + 1);
    }
    emitE164(nextDigits, el, currentCountry);

    const newMasked = formatDisplayPhone(nextDigits, currentCountry);
    const renderedValue = resolveDisplayValue(nextDigits, focused, currentCountry);
    const newPositions = nationalDigitPositions(newMasked, nextDigits);

    let caret: number;
    if (newPositions.length === 0) {
      caret = focused ? currentPrefix.length : 0;
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

    if (ev.key === "Escape" && countryOpen) {
      ev.preventDefault();
      setCountryOpen(false);
      return;
    }

    const currentCountry = countryRef.current;
    const currentPrefix = getCallingCodePrefix(currentCountry);

    if (ev.key === "Backspace" || ev.key === "Delete") {
      const el = ev.currentTarget;

      if (digitsRef.current.length === 0 && focused) {
        ev.preventDefault();
        requestAnimationFrame(() => {
          el?.setSelectionRange(currentPrefix.length, currentPrefix.length);
        });
        return;
      }

      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const masked = formatDisplayPhone(digitsRef.current, currentCountry);
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
        } else {
          ev.preventDefault();
        }
        return;
      }

      if (ev.key === "Backspace") {
        if (start <= currentPrefix.length && digitsRef.current.length === 0) {
          ev.preventDefault();
          return;
        }

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
        } else {
          ev.preventDefault();
        }
        return;
      }

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
      } else {
        ev.preventDefault();
      }
      return;
    }

    if (ev.key === "Home") {
      ev.preventDefault();
      const { min } = editableCaretBounds(
        digitsRef.current,
        focused,
        currentPrefix,
        currentCountry
      );
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
      const caret = getCallingCodePrefix(country).length;
      requestAnimationFrame(() => {
        e?.currentTarget?.setSelectionRange(caret, caret);
      });
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const handleSelectCountry = (next: PhoneCountry) => {
    setCountryOpen(false);
    if (next.code === country) return;

    setCountry(next.code);
    countryRef.current = next.code;
    digitsRef.current = "";
    if (!isControlled) {
      setFallbackDigits("");
    }

    const el = inputRef.current;
    if (el) {
      emitE164("", el, next.code);
      requestAnimationFrame(() => {
        el.focus();
        const caret = getCallingCodePrefix(next.code).length;
        el.setSelectionRange(caret, caret);
      });
    } else {
      onChange?.({
        target: { value: "", name: name ?? "" },
        currentTarget: { value: "", name: name ?? "" },
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  const isFilled = displayValue.length > 0;

  return (
    <div
      ref={rootRef}
      className={classNames("text-input", "phone-input", className, {
        "text-input--outline": variant === "outline",
        "text-input--filled": variant === "filled",
        "phone-input--open": countryOpen,
        "text-input--error": !!error,
      })}
    >
      {label ? (
        <label className="text-input__label" htmlFor={id}>
          {label}
          {required ? (
            <span className="text-input__required" aria-hidden>
              {" "}
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div className="text-input__control-wrapper phone-input__control-wrapper">
        <div
          className={classNames("phone-input__field", "text-input__control", {
            "text-input__control--filled": isFilled && !error,
          })}
        >
          <button
            type="button"
            className="phone-input__country-btn"
            aria-label="Выбор страны"
            aria-haspopup="listbox"
            aria-expanded={countryOpen}
            aria-controls={listboxId}
            disabled={disabled}
            onClick={() => setCountryOpen((open) => !open)}
          >
            <CountryFlag code={selectedCountry.code} className="phone-input__flag" />
            <Icon
              name="arrow"
              className={classNames("phone-input__chevron", {
                "phone-input__chevron--open": countryOpen,
              })}
            />
          </button>

          <input
            {...rest}
            ref={setInputRef}
            id={id}
            name={name}
            type="text"
            autoComplete="tel"
            spellCheck={false}
            inputMode={inputMode ?? "tel"}
            disabled={disabled}
            placeholder={resolvedPlaceholder}
            value={displayValue}
            className="phone-input__number"
            aria-invalid={!!error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={handleChange}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={handleCaretGuard}
            onSelect={handleCaretGuard}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        {countryOpen ? (
          <ul id={listboxId} className="phone-input__dropdown" role="listbox">
            {countries.map((option) => {
              const active = option.code === country;
              return (
                <li key={option.code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    className={classNames("phone-input__option", {
                      "phone-input__option--active": active,
                    })}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectCountry(option)}
                  >
                    <CountryFlag code={option.code} className="phone-input__flag" />
                    <span className="phone-input__option-label">
                      {formatCountryOptionLabel(option)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {!!error && (
        <p
          className={classNames("text-input__error", {
            "text-input__error--absolute": isAbsoluteError,
          })}
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default PhoneInput;
