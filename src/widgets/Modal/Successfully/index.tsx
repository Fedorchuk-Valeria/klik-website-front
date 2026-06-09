import classNames from "classnames";
import { FC, useEffect } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import Modal from "@/src/components/ui/Modal";

import { useAppDispatch } from "@/src/store/hooks";
import { hideModal } from "@/src/store/slices/modalSlice";

type PropTypes = {
  icon?: string;
  className?: string;
  isVisible: boolean;
  text?: string;
  autoCloseDelayMs?: number;
};

const WidgetModalSuccessfully: FC<PropTypes> = ({
  icon,
  text,
  className,
  isVisible,
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
      className={classNames("modal-success", className)}
    >
      {icon && (
        <div className={"modal-success__icon"}>
          <Icon name={icon} />
        </div>
      )}

      {text && <p className={"modal-success__text"}>{text}</p>}
    </Modal>
  );
};

export default WidgetModalSuccessfully;
