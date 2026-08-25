"use client";

import { useLayoutEffect } from "react";

import { AuthRedirectHelper } from "@/src/utils/helpers";

export default function AuthReturnToSync() {
  useLayoutEffect(() => {
    AuthRedirectHelper.persistReturnToFromQuery();
  }, []);

  return null;
}
