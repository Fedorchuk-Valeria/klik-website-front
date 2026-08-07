import type { CountryCode } from "libphonenumber-js";
import type { FC } from "react";

import FlagBy from "@/src/assets/images/flags/by.svg";
import FlagKz from "@/src/assets/images/flags/kz.svg";
import FlagRu from "@/src/assets/images/flags/ru.svg";
import FlagUz from "@/src/assets/images/flags/uz.svg";

const FLAGS: Partial<Record<CountryCode, FC<{ className?: string }>>> = {
  BY: FlagBy,
  KZ: FlagKz,
  RU: FlagRu,
  UZ: FlagUz,
};

type CountryFlagProps = {
  code: CountryCode;
  className?: string;
};

export default function CountryFlag({ code, className }: CountryFlagProps) {
  const Flag = FLAGS[code];
  if (!Flag) {
    return <span className={className} aria-hidden />;
  }

  return (
    <span className={className} aria-hidden>
      <Flag />
    </span>
  );
}
