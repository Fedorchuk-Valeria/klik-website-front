import { getCountryCallingCode, type CountryCode } from "libphonenumber-js";

export type PhoneCountry = {
  code: CountryCode;
  name: string;
};

/** v1 list — expand later without changing PhoneInput contract. */
export const DEFAULT_PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "BY", name: "Беларусь" },
  { code: "KZ", name: "Казахстан" },
  { code: "RU", name: "Россия" },
  { code: "UZ", name: "Узбекистан" },
];

export const DEFAULT_PHONE_COUNTRY: CountryCode = "BY";

export function getPhoneCountry(
  code: CountryCode,
  countries: PhoneCountry[] = DEFAULT_PHONE_COUNTRIES
): PhoneCountry | undefined {
  return countries.find((c) => c.code === code);
}

export function formatCountryOptionLabel(country: PhoneCountry): string {
  const calling = getCountryCallingCode(country.code);
  return `${country.name} (+${calling})`;
}
