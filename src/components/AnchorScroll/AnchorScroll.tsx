"use client";

import { useEffect } from "react";

const HEADER_OFFSET = 120;

export default function AnchorScroll() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const link = target.closest('a[href^="#"]') as HTMLAnchorElement | null;

      if (!link) return;

      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const id = href.replace("#", "");

      const element = document.getElementById(id);

      if (!element) return;

      e.preventDefault();

      const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        HEADER_OFFSET;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      window.history.pushState(null, "", href);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
