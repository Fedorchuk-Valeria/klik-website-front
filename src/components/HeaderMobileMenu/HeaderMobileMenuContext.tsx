"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type HeaderMobileMenuContextValue = {
  isOpen: boolean;
  closeMenu: () => void;
  toggleMenu: () => void;
};

export const HeaderMobileMenuContext = createContext<HeaderMobileMenuContextValue | null>(
  null,
);

export function useHeaderMobileMenu() {
  return useContext(HeaderMobileMenuContext);
}

export function HeaderMobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  useEffect(() => {
    const header = document.querySelector(".header");

    if (!header) return;

    header.classList.toggle("header--menu-open", isOpen);

    return () => {
      header.classList.remove("header--menu-open");
    };
  }, [isOpen]);

  return (
    <HeaderMobileMenuContext.Provider value={{ isOpen, closeMenu, toggleMenu }}>
      {children}
    </HeaderMobileMenuContext.Provider>
  );
}
