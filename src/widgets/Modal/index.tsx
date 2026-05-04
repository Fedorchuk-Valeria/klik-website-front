"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import { ModalType } from "@/src/entities/common";

import { RootStore } from "@/src/store";
import { useAppDispatch } from "@/src/store/hooks";
import { hideModal } from "@/src/store/slices/modalSlice";

import WidgetModalCookiePolicy from "./CookiePolicy";
import WidgetModalNotice from "./Notice";

const WidgetModal = () => {
  const dispatch = useAppDispatch();
  const { modalType, modalProps, active } = useSelector((state: RootStore) => state.modal);

  useEffect(() => {
    const handlePopState = () => {
      if (active) {
        dispatch(hideModal());
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [active, dispatch]);

  const renderModal = () => {
    switch (modalType) {
      case ModalType.NOTICE:
        return <WidgetModalNotice isVisible={active} {...modalProps} />;
      case ModalType.COOKIE_POLICY:
        return <WidgetModalCookiePolicy isVisible={active} {...modalProps} />;

      default:
        return null;
    }
  };

  return renderModal();
};

export default WidgetModal;
