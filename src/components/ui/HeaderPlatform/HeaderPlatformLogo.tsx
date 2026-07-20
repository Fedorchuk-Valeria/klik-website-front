"use client";

import LogoFillSvg from "@/src/assets/images/logo-fill.svg";
import Link from "next/link";

export default function HeaderLogo() {
  return (
    <Link className="header__logo" href="/">
      <LogoFillSvg />
    </Link>
  );
}
