"use client";

import LogoFillSvg from "@/src/assets/images/logo-fill.svg";
import LogoSvg from "@/src/assets/images/logo.svg";
import { scrollToTop } from "@/src/lib/scrollToTop";
import { PAGES } from "@/src/utils/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderLogo({ variant }: { variant: "light" | "dark" }) {
  const pathname = usePathname();

  const logos = {
    light: LogoFillSvg,
    dark: LogoSvg,
  };

  const LogoComponent = logos[variant];

  const handleClick = (e: React.MouseEvent) => {
    if (pathname === PAGES.COURSES) {
      e.preventDefault();

      scrollToTop({ behavior: "smooth" });
    }
  };

  return (
    <Link className="header__logo" href={PAGES.COURSES} onClick={handleClick}>
      <LogoComponent />
    </Link>
  );
}
