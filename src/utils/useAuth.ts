"use client";

import { useEffect, useState } from "react";
import {CookieHelper} from "@/src/utils/helpers";
import {REFRESH_TOKEN_KEY, TOKEN_KEY} from "@/src/utils/constant";

export const useAuth = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth =
      !!CookieHelper.getCookie(TOKEN_KEY) &&
      !!CookieHelper.getCookie(REFRESH_TOKEN_KEY);

    setIsAuthenticated(auth);
    setIsMounted(true);
  }, []);

  return {
    isAuthenticated,
    isMounted,
  };
};
