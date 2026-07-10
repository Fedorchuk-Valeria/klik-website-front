"use client";

import { useEffect } from "react";

export default function HeaderScroll() {
  useEffect(() => {
    const header = document.querySelector(".header");

    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("header--scrolled", window.scrollY > 20);
    };

    onScroll(); // сразу выставляем состояние

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
