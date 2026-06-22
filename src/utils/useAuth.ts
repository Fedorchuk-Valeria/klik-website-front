"use client";

import { useEffect, useState } from "react";

import { REFRESH_TOKEN_KEY, TOKEN_KEY } from "@/src/utils/constant";
import { CookieHelper } from "@/src/utils/helpers";

export const useAuth = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = !!CookieHelper.getCookie(TOKEN_KEY) && !!CookieHelper.getCookie(REFRESH_TOKEN_KEY);

    queueMicrotask(() => {
      setIsAuthenticated(auth);
      setIsMounted(true);
    });
  }, []);

  return {
    isAuthenticated,
    isMounted,
  };
};
