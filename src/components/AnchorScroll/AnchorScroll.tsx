"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

import {
  scrollToHomeAnchor,
  scrollToHomeAnchorWhenReady,
} from "@/src/lib/scrollToHomeAnchor";
import { PENDING_HOME_ANCHOR_KEY } from "@/src/utils/constant";

export default function AnchorScroll() {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    if (pathname !== "/") return;

    tryConsumeHashForHomeScroll();

    requestAnimationFrame(() => {
      tryConsumeHashForHomeScroll();
    });
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    const pending = sessionStorage.getItem(PENDING_HOME_ANCHOR_KEY);
    if (!pending) return;

    sessionStorage.removeItem(PENDING_HOME_ANCHOR_KEY);
    window.scrollTo(0, 0);
    scrollToHomeAnchorWhenReady(pending, { announce: true, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    const handleHashChange = () => {
      tryConsumeHashForHomeScroll();
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a") as HTMLAnchorElement | null;

      if (!link || link.closest(".header__mobile")) return;

      const id = resolveSamePageAnchorId(link.getAttribute("href"));
      if (!id || !document.getElementById(id)) return;

      e.preventDefault();
      scrollToHomeAnchor(id, { behavior: "smooth", updateHash: true, announce: true });
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}

function resolveSamePageAnchorId(href: string | null): string | null {
  if (!href || href === "#") return null;

  if (href.startsWith("#")) {
    const id = decodeURIComponent(href.slice(1));
    return id || null;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.pathname !== window.location.pathname) return null;
    if (!url.hash || url.hash === "#") return null;

    const id = decodeURIComponent(url.hash.slice(1));
    return id || null;
  } catch {
    return null;
  }
}

function tryConsumeHashForHomeScroll() {
  if (window.location.pathname !== "/") return;

  const rawHash = window.location.hash;
  if (!rawHash || rawHash === "#") return;

  const id = decodeURIComponent(rawHash.slice(1));
  if (!id) return;

  scrollToHomeAnchorWhenReady(id, { announce: true, behavior: "smooth" });

  const { pathname: path, search } = window.location;
  window.history.replaceState(null, "", path + search);
}
