"use client";

import { useEffect } from "react";

import { ModalType } from "@/src/entities/common";
import { useAppDispatch } from "@/src/store/hooks";
import { showModal } from "@/src/store/slices/modalSlice";
import { hasCookieConsentForEnvironment } from "@/src/utils/clientCookies";

const CookiePolicyListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!hasCookieConsentForEnvironment()) {
      dispatch(
        showModal({
          modalType: ModalType.COOKIE_POLICY,
        })
      );
    }
  }, [dispatch]);

  return null;
};

export default CookiePolicyListener;
