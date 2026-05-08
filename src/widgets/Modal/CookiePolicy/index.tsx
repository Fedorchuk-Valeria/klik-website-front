"use client";

import classNames from "classnames";
import { FC, useCallback } from "react";

import Modal from "@/src/components/ui/Modal";
import { useAppDispatch } from "@/src/store/hooks";
import { hideModal } from "@/src/store/slices/modalSlice";
import CookiePolicyContent from "./Content";

type PropTypes = {
  isVisible: boolean;
  className?: string;
};

const WidgetModalCookiePolicy: FC<PropTypes> = ({ className, isVisible }) => {
  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    dispatch(hideModal());
  }, [dispatch]);

  return (
    <Modal className={classNames("cookie-policy-modal", className)} isVisible={isVisible}>
      <CookiePolicyContent onClose={handleClose} />
    </Modal>
  );
};

export default WidgetModalCookiePolicy;
