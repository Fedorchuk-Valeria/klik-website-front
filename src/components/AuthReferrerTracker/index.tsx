"use client";

// Remembers the last non-auth page so registration can pick the correct CRM branch.
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { isAuthPath, saveAuthReferrer } from "@/src/utils/helpers/branch";

export default function AuthReferrerTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || isAuthPath(pathname)) {
      return;
    }

    saveAuthReferrer(pathname);
  }, [pathname]);

  return null;
}
