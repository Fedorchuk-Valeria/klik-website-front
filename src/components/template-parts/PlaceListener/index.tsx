"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { RootStore } from "@/src/store";
import { useAppDispatch } from "@/src/store/hooks";
import { showModal } from "@/src/store/slices/modalSlice";

import { ModalType } from "@/src/entities/common";
import { getClientCookie } from "@/src/utils/clientCookies";
import { COOKIE_CONSENT_STORAGE_KEY, PLACE_STORAGE_KEY } from "@/src/utils/constant";

const PlaceListener = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { active } = useSelector((state: RootStore) => state.modal);

  useEffect(() => {
    const cookiePolicy = getClientCookie(COOKIE_CONSENT_STORAGE_KEY);
    const place = getClientCookie(PLACE_STORAGE_KEY);

    if (cookiePolicy && !place && !active) {
      dispatch(showModal({ modalType: ModalType.PLACE_SELECT }));
    }

    if (place) {
      router.push(place);
    }
  }, [dispatch, active, router]);

  return null;
};

export default PlaceListener;
