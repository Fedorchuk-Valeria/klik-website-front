"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { RootStore } from "@/src/store";
import { useAppDispatch } from "@/src/store/hooks";
import { showModal } from "@/src/store/slices/modalSlice";

import { ModalType } from "@/src/entities/common";
import { getPlaceCookie, hasCookieConsentForEnvironment } from "@/src/utils/clientCookies";

const PlaceListener = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { active } = useSelector((state: RootStore) => state.modal);

  useEffect(() => {
    const cookiePolicy = hasCookieConsentForEnvironment();
    const place = getPlaceCookie();

    if (cookiePolicy && !active) {
      if (!place || new URL(place).origin !== window.location.origin) {
        dispatch(showModal({ modalType: ModalType.PLACE_SELECT }));
      }
    }
  }, [dispatch, active, router]);

  return null;
};

export default PlaceListener;
