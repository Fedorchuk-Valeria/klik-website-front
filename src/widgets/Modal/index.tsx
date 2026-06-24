"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import { ModalType } from "@/src/entities/common";

import { RootStore } from "@/src/store";
import { useAppDispatch } from "@/src/store/hooks";
import { hideModal } from "@/src/store/slices/modalSlice";

import { Course } from "@/src/lib/getCourses";

import WidgetModalAccountData from "@/src/widgets/Modal/AccountData";
import WidgetModalCookiePolicy from "@/src/widgets/Modal/CookiePolicy";
import WidgetModalCreateChildren from "@/src/widgets/Modal/CreateChildren";
import WidgetModalNotice from "@/src/widgets/Modal/Notice";
import WidgetModalPayment from "@/src/widgets/Modal/Payment";
import WidgetModalPaymentChildren from "@/src/widgets/Modal/PaymentChildren";
import WidgetModalPaymentStatus from "@/src/widgets/Modal/PaymentStatus";
import WidgetModalPlace from "@/src/widgets/Modal/Place";
import WidgetModalSuccessfully from "@/src/widgets/Modal/Successfully";

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
      case ModalType.PLACE_SELECT:
        return <WidgetModalPlace isVisible={active} {...modalProps} />;
      case ModalType.SUCCESSFULLY:
        return <WidgetModalSuccessfully isVisible={active} {...modalProps} />;
      case ModalType.PAYMENT:
        return <WidgetModalPayment isVisible={active} {...(modalProps as { course: Course })} />;
      case ModalType.PAYMENT_STATUS:
        return <WidgetModalPaymentStatus isVisible={active} {...modalProps} />;
      case ModalType.CREATE_CHILDREN:
        return <WidgetModalCreateChildren isVisible={active} {...modalProps} />;
      case ModalType.PAYMENT_CHILDREN:
        return <WidgetModalPaymentChildren isVisible={active} {...modalProps} />;
      case ModalType.ACCOUNT_DATA:
        return <WidgetModalAccountData isVisible={active} {...modalProps} />;
      default:
        return null;
    }
  };

  return renderModal();
};

export default WidgetModal;
