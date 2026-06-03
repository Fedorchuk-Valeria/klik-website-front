export function getPlural(
  number: number,
  forms: [string, string, string]
): string {
  const cases = [2, 0, 1, 1, 1, 2];

  const index =
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[Math.min(number % 10, 5)];

  return forms[index].replace("%d", String(number));
}
