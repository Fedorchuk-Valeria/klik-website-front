export const CODE_LENGTH = 4;

export function sanitizeDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, CODE_LENGTH);
}

export function parsePastedToDigits(text: string): string {
  return sanitizeDigits(text);
}
