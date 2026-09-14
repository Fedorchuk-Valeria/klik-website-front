export const PASSWORD_LATIN_ONLY_ERROR =
  "Пожалуйста, используйте только латинские буквы, цифры и спецсимволы";

const CYRILLIC_REGEX = /[\u0400-\u04FF]/;

/** Strips invalid chars but keeps Cyrillic so validation can be shown. */
const PASSWORD_INPUT_STRIP_KEEP_CYRILLIC_REGEX =
  /[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\u0400-\u04FF]/g;

export type NormalizePasswordInputResult = {
  value: string;
  hasCyrillic: boolean;
};

export function normalizePasswordInput(value: string): NormalizePasswordInputResult {
  const normalized = value.replace(PASSWORD_INPUT_STRIP_KEEP_CYRILLIC_REGEX, "");
  const hasCyrillic = CYRILLIC_REGEX.test(normalized);

  return { value: normalized, hasCyrillic };
}

export function getPasswordLatinOnlyError(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const { hasCyrillic } = normalizePasswordInput(String(value));

  return hasCyrillic ? PASSWORD_LATIN_ONLY_ERROR : null;
}
