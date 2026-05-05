"use client";

import classNames from "classnames";
import { FC } from "react";

import Modal from "@/src/components/ui/Modal";
import CookiePolicyContent from "./Content";

type PropTypes = {
  isVisible: boolean;
  className?: string;
};

const WidgetModalCookiePolicy: FC<PropTypes> = ({ className, isVisible }) => {
  return (
    <Modal className={classNames("cookie-policy-modal", className)} isVisible={isVisible}>
      <CookiePolicyContent />
    </Modal>
  );
};

export default WidgetModalCookiePolicy;
