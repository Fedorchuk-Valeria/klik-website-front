import {
  formatIncompletePhoneNumber,
  getCountryCallingCode,
  getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

export function getCallingCodePrefix(country: CountryCode): string {
  return `+${getCountryCallingCode(country)}`;
}

export function getMaxNationalDigits(country: CountryCode): number {
  return getExampleNumber(country, examples)?.nationalNumber.length ?? 15;
}

const PLACEHOLDERS: Partial<Record<CountryCode, string>> = {
  BY: "+375 (29) 123 45 67",
  KZ: "+7 771 000 99 98",
  RU: "+7 912 345 67 89",
  UZ: "+998 91 234 56 78",
};

export function getExamplePlaceholder(country: CountryCode): string {
  const fixed = PLACEHOLDERS[country];
  if (fixed) return fixed;

  const example = getExampleNumber(country, examples);
  if (!example) {
    return getCallingCodePrefix(country);
  }
  return adaptDisplayFormat(country, example.formatInternational());
}

/** National subscriber digits only (no calling code). */
export function extractNationalDigits(input: string, country: CountryCode): string {
  const max = getMaxNationalDigits(country);
  const prefixDigits = getCountryCallingCode(country);
  let d = input.replace(/\D/g, "");

  if (d.startsWith(prefixDigits)) {
    d = d.slice(prefixDigits.length);
  } else if (country === "BY" && d.startsWith("80")) {
    d = d.slice(2);
  } else if ((country === "RU" || country === "KZ") && d.startsWith("8") && d.length > 1) {
    d = d.slice(1);
  }

  return d.slice(0, max);
}

export function parsePastedNationalDigits(text: string, country: CountryCode): string {
  const trimmed = text.trim();
  const parsed = parsePhoneNumberFromString(trimmed, country);
  if (parsed?.nationalNumber) {
    return parsed.nationalNumber.slice(0, getMaxNationalDigits(country));
  }
  return extractNationalDigits(trimmed, country);
}

/**
 * Display string for national digits. Empty → "".
 * BY follows design parentheses: `+375 (29) 123 45 67`.
 */
export function formatDisplayPhone(nationalDigits: string, country: CountryCode): string {
  const d = nationalDigits.replace(/\D/g, "").slice(0, getMaxNationalDigits(country));
  if (d.length === 0) return "";

  const incomplete = `${getCallingCodePrefix(country)}${d}`;
  const formatted = formatIncompletePhoneNumber(incomplete, country);
  return adaptDisplayFormat(country, formatted);
}

/** BY design uses parentheses around the operator code. */
function adaptDisplayFormat(country: CountryCode, formatted: string): string {
  if (country !== "BY") return formatted;

  // `+375 29 123 45 67` → `+375 (29) 123 45 67`
  // `+375 2` → `+375 (2`
  return formatted.replace(/^\+375\s(\d{1,2})(.*)$/, (_, code: string, rest: string) => {
    if (code.length < 2) {
      return `+375 (${code}${rest}`;
    }
    return `+375 (${code})${rest}`;
  });
}

export function toE164(nationalDigits: string, country: CountryCode): string {
  const d = nationalDigits.replace(/\D/g, "").slice(0, getMaxNationalDigits(country));
  if (d.length === 0) return "";
  return `${getCallingCodePrefix(country)}${d}`;
}

export function isPhoneComplete(value: string): boolean {
  if (!value) return false;
  return isValidPhoneNumber(value);
}

/**
 * Character indexes of national digits in the formatted string.
 * Skips the calling-code prefix so digits like 3/7/5 in `+375` are not matched.
 */
export function nationalDigitPositions(
  masked: string,
  nationalDigits: string,
  prefix: string
): number[] {
  const d = nationalDigits.replace(/\D/g, "");
  const start = masked.startsWith(prefix) ? prefix.length : 0;
  const positions: number[] = [];
  let remaining = d.length;
  for (let i = start; i < masked.length && remaining > 0; i++) {
    const ch = masked[i];
    if (ch >= "0" && ch <= "9") {
      positions.push(i);
      remaining--;
    }
  }
  return positions;
}

/** National digit to the left of the caret (Backspace). */
export function digitIndexBeforeCaret(caret: number, positions: readonly number[]): number {
  for (let i = positions.length - 1; i >= 0; i--) {
    if (positions[i] < caret) return i;
  }
  return -1;
}

/** National digit at or to the right of the caret (Delete). */
export function digitIndexAtOrAfterCaret(caret: number, positions: readonly number[]): number {
  for (let i = 0; i < positions.length; i++) {
    if (positions[i] >= caret) return i;
  }
  return -1;
}

export function editableCaretBounds(
  nationalDigits: string,
  focused: boolean,
  prefix: string,
  country: CountryCode
): { min: number; max: number } {
  const d = nationalDigits.replace(/\D/g, "");
  if (d.length === 0) {
    if (focused) {
      const len = prefix.length;
      return { min: len, max: len };
    }
    return { min: 0, max: 0 };
  }

  const masked = formatDisplayPhone(d, country);
  const positions = nationalDigitPositions(masked, d, prefix);
  if (positions.length === 0) {
    return { min: prefix.length, max: masked.length };
  }
  return { min: positions[0], max: masked.length };
}

export function digitInsertIndexFromCaret(
  caret: number,
  masked: string,
  nationalDigits: string,
  prefix: string
): number {
  const d = nationalDigits.replace(/\D/g, "");
  if (d.length === 0 && caret <= prefix.length) {
    return 0;
  }

  const positions = nationalDigitPositions(masked, d, prefix);
  if (positions.length === 0) {
    return 0;
  }

  for (let i = positions.length - 1; i >= 0; i--) {
    if (caret > positions[i]) {
      return Math.min(i + 1, d.length + 1);
    }
  }

  return 0;
}

export function caretAfterDigitIndex(
  masked: string,
  nationalDigits: string,
  digitIndex: number,
  prefix: string,
  focused: boolean
): number {
  const d = nationalDigits.replace(/\D/g, "");
  if (d.length === 0 && focused) {
    return prefix.length;
  }

  const positions = nationalDigitPositions(masked, d, prefix);
  if (digitIndex >= 0 && digitIndex < positions.length) {
    return positions[digitIndex] + 1;
  }

  return masked.length;
}

export function resolveCountryFromE164(
  value: string,
  fallback: CountryCode,
  allowed: CountryCode[]
): CountryCode {
  // Prefer fallback for ambiguous calling codes (RU/KZ both +7).
  if (allowed.includes(fallback)) {
    const withFallback = parsePhoneNumberFromString(value, fallback);
    if (withFallback?.countryCallingCode === getCountryCallingCode(fallback)) {
      return fallback;
    }
  }

  const parsed = parsePhoneNumberFromString(value);
  if (parsed?.country && allowed.includes(parsed.country)) {
    return parsed.country;
  }

  return allowed.includes(fallback) ? fallback : (allowed[0] ?? fallback);
}

export function nationalDigitsFromE164(value: string, country: CountryCode): string {
  if (!value) return "";
  const parsed = parsePhoneNumberFromString(value, country);
  if (parsed?.nationalNumber) {
    return parsed.nationalNumber.slice(0, getMaxNationalDigits(country));
  }
  return extractNationalDigits(value, country);
}
