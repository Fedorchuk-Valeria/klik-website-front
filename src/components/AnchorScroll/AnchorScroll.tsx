"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

import {
  HEADER_ANCHOR_OFFSET_PX,
  PENDING_HOME_ANCHOR_KEY,
  SET_ACTIVE_ANCHOR_EVENT,
} from "@/src/utils/constant";

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
    scrollToAnchorElement(pending, { announce: true });
  }, [pathname]);

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

      const top = element.getBoundingClientRect().top + window.scrollY - HEADER_ANCHOR_OFFSET_PX;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      window.history.pushState(null, "", href);
      notifyActiveAnchor(id);
      window.setTimeout(() => notifyActiveAnchor(id), 550);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}

function notifyActiveAnchor(id: string) {
  window.dispatchEvent(new CustomEvent(SET_ACTIVE_ANCHOR_EVENT, { detail: { id } }));
}

function snapScrollToAnchor(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const drift = Math.abs(element.getBoundingClientRect().top - HEADER_ANCHOR_OFFSET_PX);
  if (drift < 6) return;

  const top = element.getBoundingClientRect().top + window.scrollY - HEADER_ANCHOR_OFFSET_PX;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "auto",
  });
}

/** One layout fix after smooth scroll finishes — not mid-animation (avoids visible "jump"). */
function schedulePostScrollSnap(id: string) {
  let completed = false;

  const finish = () => {
    if (completed) return;
    completed = true;
    snapScrollToAnchor(id);
    notifyActiveAnchor(id);
  };

  const onScrollEnd = () => {
    window.removeEventListener("scrollend", onScrollEnd);
    window.clearTimeout(fallbackId);
    finish();
  };

  if (typeof window !== "undefined" && "onscrollend" in window) {
    window.addEventListener("scrollend", onScrollEnd, { passive: true });
  }

  const fallbackId = window.setTimeout(() => {
    window.removeEventListener("scrollend", onScrollEnd);
    finish();
  }, 1200);
}

type ScrollToAnchorOptions = {
  announce?: boolean;
};

function scrollToAnchorElement(id: string, options?: ScrollToAnchorOptions) {
  const announce = options?.announce ?? false;
  let frames = 0;
  const maxFrames = 240;

  const tick = () => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - HEADER_ANCHOR_OFFSET_PX;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      });
      if (announce) {
        notifyActiveAnchor(id);
        schedulePostScrollSnap(id);
      }
      return;
    }
    frames += 1;
    if (frames < maxFrames) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

function tryConsumeHashForHomeScroll() {
  if (window.location.pathname !== "/") return;

  const rawHash = window.location.hash;
  if (!rawHash || rawHash === "#") return;

  const id = decodeURIComponent(rawHash.slice(1));
  if (!id) return;

  const { pathname: path, search } = window.location;
  window.history.replaceState(null, "", path + search);

  window.scrollTo(0, 0);

  scrollToAnchorElement(id, { announce: true });
}
