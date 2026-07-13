function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function daysInMonth(m: number, y: number): number {
  if (m === 2) return isLeapYear(y) ? 29 : 28;
  if (m === 4 || m === 6 || m === 9 || m === 11) return 30;
  return 31;
}

export function isValidCalendarDate(
  dd: number,
  mm: number,
  yyyy: number,
  maxYear: number
): boolean {
  if (yyyy < 1900 || yyyy > maxYear) return false;
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > daysInMonth(mm, yyyy)) return false;
  return true;
}

/** True if DDMMYYYY-digit prefix could extend to a valid date (respecting leap years). Max 8 digits. */
export function isValidDigitsPrefix(nums: string, maxYear: number): boolean {
  if (nums.length === 0) return true;
  if (!/^\d+$/.test(nums) || nums.length > 8) return false;

  const n = nums.length;

  if (n === 1) {
    return nums[0] <= "3";
  }

  const dd = Number(`${nums[0]}${nums[1]}`);
  if (n === 2) {
    return dd >= 1 && dd <= 31;
  }

  if (dd < 1 || dd > 31) return false;

  if (n === 3) {
    return nums[2] <= "1";
  }

  const mm = Number(`${nums[2]}${nums[3]}`);
  if (mm < 1 || mm > 12) return false;

  /* Complete day + month, year still empty or partial — need some year where day fits in month */
  if (n === 4) {
    for (let y = 1900; y <= maxYear; y++) {
      if (dd <= daysInMonth(mm, y)) return true;
    }
    return false;
  }

  if (n === 8) {
    const yyyy = Number(nums.slice(4, 8));
    return isValidCalendarDate(dd, mm, yyyy, maxYear);
  }

  const yPrefix = nums.slice(4);
  for (let y = 1900; y <= maxYear; y++) {
    if (!String(y).startsWith(yPrefix)) continue;
    if (dd <= daysInMonth(mm, y)) return true;
  }
  return false;
}

/** Trims trailing digits until the string is an allowed prefix / full date */
export function sanitizeDigits(rawDigits: string, maxYear: number): string {
  let digits = rawDigits.replace(/\D/g, "").slice(0, 8);
  while (digits.length > 0 && !isValidDigitsPrefix(digits, maxYear)) {
    digits = digits.slice(0, -1);
  }
  return digits;
}

/** DD.MM.YYYY style display with dots between filled segments only */
export function formatMasked(nums: string): string {
  if (nums.length === 0) return "";

  let out = nums.slice(0, Math.min(2, nums.length));
  if (nums.length <= 2) return out;

  out += "." + nums.slice(2, Math.min(4, nums.length));

  if (nums.length <= 4) return out;

  return out + "." + nums.slice(4, Math.min(8, nums.length));
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function parseEightAsYyyymmdd(eight: string, maxYear: number): string | null {
  const y = Number(eight.slice(0, 4));
  const m = Number(eight.slice(4, 6));
  const d = Number(eight.slice(6, 8));
  if (!isValidCalendarDate(d, m, y, maxYear)) return null;
  return `${pad2(d)}${pad2(m)}${String(y)}`;
}

function parseEightAsDdmmyyyy(eight: string, maxYear: number): string | null {
  const dd = Number(eight.slice(0, 2));
  const mm = Number(eight.slice(2, 4));
  const yyyy = Number(eight.slice(4, 8));
  if (!isValidCalendarDate(dd, mm, yyyy, maxYear)) return null;
  return eight;
}

/**
 * Paste / external string → DDMMYYYY digits, then validation via sanitizeDigits.
 * Supports YYYY-MM-DD, DD.MM.YYYY / DD/MM/YYYY, compact YYYYMMDD and DDMMYYYY.
 */
export function parsePastedToDigits(text: string, maxYear: number): string {
  const t = text.trim();

  const ymd = t.match(/\b(\d{4})[^\d]{0,2}(\d{1,2})[^\d]{0,2}(\d{1,2})\b/);
  if (ymd) {
    const yyyy = Number(ymd[1]);
    const m = Number(ymd[2]);
    const d = Number(ymd[3]);
    return sanitizeDigits(`${pad2(d)}${pad2(m)}${String(yyyy)}`.replace(/\D/g, ""), maxYear);
  }

  const dmy = t.match(/\b(\d{1,2})[^\d]{0,2}(\d{1,2})[^\d]{0,2}(\d{4})\b/);
  if (dmy) {
    const d = Number(dmy[1]);
    const m = Number(dmy[2]);
    const yyyy = Number(dmy[3]);
    return sanitizeDigits(`${pad2(d)}${pad2(m)}${String(yyyy)}`.replace(/\D/g, ""), maxYear);
  }

  const digitsOnly = t.replace(/\D/g, "").slice(0, 40);
  if (!digitsOnly) return "";

  const chunk = digitsOnly.slice(0, Math.min(8, digitsOnly.length));

  if (chunk.length === 8) {
    const asIso = parseEightAsYyyymmdd(chunk, maxYear);
    if (asIso) return asIso;

    const asEu = parseEightAsDdmmyyyy(chunk, maxYear);
    if (asEu) return asEu;
  }

  return sanitizeDigits(chunk, maxYear);
}
