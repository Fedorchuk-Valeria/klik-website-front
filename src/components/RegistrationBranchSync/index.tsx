"use client";

// Client island for LoginLayout: sets branch_id cookie when auth screens mount.
import { useEffect } from "react";

import { syncRegistrationBranchCookie } from "@/src/utils/helpers/branch";

export default function RegistrationBranchSync() {
  useEffect(() => {
    syncRegistrationBranchCookie();
  }, []);

  return null;
}
