/** National subscriber digits after +375 (2 + 3 + 2 + 2 = 9). */
export const PHONE_NATIONAL_DIGIT_COUNT = 9;

/**
 * Parses pasted or typed text into up to 9 national digits after +375.
 * Accepts formats with +375, leading 375, or national 80… prefix.
 */
export function extractNationalDigits(input: string): string {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("375")) {
    d = d.slice(3);
  } else if (d.startsWith("80")) {
    d = d.slice(2);
  }
  return d.slice(0, PHONE_NATIONAL_DIGIT_COUNT);
}

/** `+375 (XX) XXX XX XX` — only typed digits; empty string if none. */
export function formatMaskedPhone(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, PHONE_NATIONAL_DIGIT_COUNT);
  if (d.length === 0) return "";

  if (d.length <= 2) {
    return "+375 (" + d + (d.length === 2 ? ") " : "");
  }

  let out = "+375 (" + d.slice(0, 2) + ") " + d.slice(2, Math.min(5, d.length));
  if (d.length <= 5) {
    return out;
  }
  out += " " + d.slice(5, Math.min(7, d.length));
  if (d.length <= 7) {
    return out;
  }
  return out + " " + d.slice(7, 9);
}

export function parsePastedToNationalDigits(text: string): string {
  return extractNationalDigits(text.trim());
}

/**
 * Character indices in `masked` (from {@link formatMaskedPhone}) that belong to national
 * digits, in order. Used to map the caret to digit deletion (mask literals are skipped).
 */
export function nationalDigitPositions(masked: string, nationalDigits: string): number[] {
  const d = nationalDigits.replace(/\D/g, "").slice(0, PHONE_NATIONAL_DIGIT_COUNT);
  const positions: number[] = [];
  const prefix = "+375 (";
  if (!masked.startsWith(prefix)) {
    return positions;
  }

  let from = prefix.length;
  let k = 0;

  function findDigit(fromIdx: number, ch: string): number {
    for (let j = fromIdx; j < masked.length; j++) {
      if (masked[j] === ch) return j;
    }
    return -1;
  }

  while (k < d.length && k < 2) {
    const found = findDigit(from, d[k]);
    if (found === -1) return positions;
    positions.push(found);
    from = found + 1;
    k++;
  }

  if (k === 2) {
    const closeIdx = masked.indexOf(")", from - 1);
    if (closeIdx !== -1) {
      from = closeIdx + 1;
      if (masked[from] === " ") from += 1;
    }
  }

  while (k < d.length) {
    const found = findDigit(from, d[k]);
    if (found === -1) return positions;
    positions.push(found);
    from = found + 1;
    k++;
  }

  return positions;
}

/** True when all 9 digits after +375 are present. */
export function isPhoneComplete(nationalDigits: string): boolean {
  return extractNationalDigits(nationalDigits).length === PHONE_NATIONAL_DIGIT_COUNT;
}
