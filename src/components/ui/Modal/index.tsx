"use client";

import classNames from "classnames";
import { DialogHTMLAttributes, FC, useCallback, useEffect, useRef } from "react";

import useHideBodyScroll from "@/src/hooks/useHideBodyScroll";

import { useAppDispatch } from "@/src/store/hooks";
import { hideModal } from "@/src/store/slices/modalSlice";

type PropTypes = DialogHTMLAttributes<HTMLDialogElement> & {
  isClose?: boolean;
  isCloseBg?: boolean;
  isVisible: boolean;
  onClose?: () => void;
};

const Modal: FC<PropTypes> = ({
  isVisible,
  className,
  children,
  isClose,
  isCloseBg,
  onClose,
  ...props
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const dispatch = useAppDispatch();

  useHideBodyScroll(isVisible);

  const handleClose = useCallback(() => {
    ref?.current?.close();
    dispatch(hideModal());

    if (onClose) onClose();
  }, [dispatch, onClose]);

  const handleCloseModal = useCallback(() => {
    if (!isCloseBg && !isClose) return;

    handleClose();
  }, [isCloseBg, isClose, handleClose]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (isVisible) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    return () => {
      dialog.close();
    };
  }, [isVisible]);

  return (
    <div className={classNames("modal", className)}>
      <dialog ref={ref} {...props} onCancel={handleCloseModal}>
        {children}
      </dialog>
    </div>
  );
};

export default Modal;
