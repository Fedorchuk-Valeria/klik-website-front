import type { CountryCode } from "libphonenumber-js";

import type { TextInputProps } from "../TextInput";

import type { PhoneCountry } from "./phoneCountries";

export type PhoneInputProps = Omit<TextInputProps, "type" | "addonAfter" | "placeholder"> & {
  /** ISO country used when value is empty. Default: BY */
  defaultCountry?: CountryCode;
  /** Countries shown in the select. Default: BY, KZ, RU, UZ */
  countries?: PhoneCountry[];
  showCountrySelector?: boolean;
};
