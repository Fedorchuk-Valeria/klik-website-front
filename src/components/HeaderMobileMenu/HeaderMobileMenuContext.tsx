"use client";

import { createContext, useCallback, useContext, useState } from "react";

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

  return (
    <HeaderMobileMenuContext.Provider value={{ isOpen, closeMenu, toggleMenu }}>
      {children}
    </HeaderMobileMenuContext.Provider>
  );
}
