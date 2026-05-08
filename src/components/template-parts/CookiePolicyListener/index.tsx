"use client";

import { useEffect } from "react";

import { ModalType } from "@/src/entities/common";
import { useAppDispatch } from "@/src/store/hooks";
import { showModal } from "@/src/store/slices/modalSlice";
import { COOKIE_CONSENT_STORAGE_KEY } from "@/src/utils/constant";

const CookiePolicyListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const cookiePolicy = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

    if (!cookiePolicy) {
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
