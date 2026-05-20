"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PENDING_HOME_ANCHOR_KEY } from "@/src/utils/constant";

type Props = {
  anchor: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function getAnchorIdFromHref(url: string): string {
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) return "";
  return url.slice(hashIndex + 1);
}

export default function HomeAnchorLink({ anchor, children, className, onClick }: Props) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const id = anchor.startsWith("#") ? anchor.slice(1) : anchor;

  if (isHomePage) {
    return (
      <a href={`#${id}`} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link
      href="/"
      scroll={false}
      className={className}
      onClick={() => {
        if (id) {
          sessionStorage.setItem(PENDING_HOME_ANCHOR_KEY, id);
        }
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
