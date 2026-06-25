"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useHeaderMobileMenu } from "@/src/components/HeaderMobileMenu/HeaderMobileMenuContext";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function HeaderLogoLink({ className, children }: Props) {
  const pathname = usePathname();
  const mobileMenu = useHeaderMobileMenu();

  return (
    <Link
      className={className}
      href="/"
      scroll
      onClick={(e) => {
        if (mobileMenu?.isOpen) {
          mobileMenu.closeMenu();
        }

        if (pathname !== "/") return;

        e.preventDefault();
        const { pathname: path, search } = window.location;

        if (window.location.hash) {
          window.history.replaceState(null, "", path + search);
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      {children}
    </Link>
  );
}
