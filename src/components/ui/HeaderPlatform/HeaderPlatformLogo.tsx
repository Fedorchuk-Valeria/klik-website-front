"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PAGES } from "@/src/utils/constant";
import LogoFillSvg from "@/src/assets/images/logo-fill.svg";
import LogoSvg from "@/src/assets/images/logo.svg";

type Props = {
  LogoComponent: React.ElementType;
};

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

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <Link className="header__logo" href={PAGES.COURSES} onClick={handleClick}>
      <LogoComponent />
    </Link>
  );
}
