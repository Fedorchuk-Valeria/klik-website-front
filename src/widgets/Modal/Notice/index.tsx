import classNames from "classnames";
import { FC, useEffect } from "react";

import Modal from "@/src/components/ui/Modal";

import { useAppDispatch } from "@/src/store/hooks";
import { hideModal } from "@/src/store/slices/modalSlice";

type PropTypes = {
  title?: string;
  className?: string;
  isVisible: boolean;
  description?: string;
  autoCloseDelayMs?: number;
};

const WidgetModalNotice: FC<PropTypes> = ({
  title,
  className,
  isVisible,
  description,
  autoCloseDelayMs,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isVisible || autoCloseDelayMs == null || autoCloseDelayMs <= 0) return;

    const id = window.setTimeout(() => {
      dispatch(hideModal());
    }, autoCloseDelayMs);

    return () => window.clearTimeout(id);
  }, [dispatch, isVisible, autoCloseDelayMs]);

  return (
    <Modal
      isClose
      isCloseBg
      isVisible={isVisible}
      className={classNames("modal-notice", className)}
    >
      {!!title && <p className={"modal-notice__title"}>{title}</p>}

      {!!description && <p className={"modal-notice__description"}>{description}</p>}
    </Modal>
  );
};

export default WidgetModalNotice;
