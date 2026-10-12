export function getPlural(number: number, forms: string[]): string {
  const absNumber = Math.abs(number);

  if (!Number.isInteger(absNumber)) {
    return forms[2].replace("%d", String(number));
  }

  const cases = [2, 0, 1, 1, 1, 2];

  const lastTwoDigits = absNumber % 100;
  const lastDigit = absNumber % 10;

  const index = lastTwoDigits > 4 && lastTwoDigits < 20 ? 2 : cases[Math.min(lastDigit, 5)];

  return forms[index].replace("%d", String(number));
}
