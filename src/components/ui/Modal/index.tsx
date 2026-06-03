"use client";

import classNames from "classnames";
import { DialogHTMLAttributes, FC, useCallback, useEffect, useRef } from "react";

import useHideBodyScroll from "@/src/hooks/useHideBodyScroll";

import { useAppDispatch } from "@/src/store/hooks";
import { hideModal } from "@/src/store/slices/modalSlice";
import Icon from "@/src/components/ui/Icon/Icon";

type PropTypes = DialogHTMLAttributes<HTMLDialogElement> & {
  isClose?: boolean;
  isCloseBg?: boolean;
  isVisible: boolean;
  isHideBg?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
};

const Modal: FC<PropTypes> = ({
  isVisible,
  className,
  children,
  isClose,
  isCloseBg,
  isHideBg,
  onClose,
  showCloseButton = false,
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

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (!isCloseBg) return;

      // клик именно по backdrop
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose, isCloseBg]
  );

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
    <div className={classNames("modal", className, { "modal--show-bg": !isHideBg })}>
      <dialog
        ref={ref}
        {...props}
        onCancel={handleCloseModal}
        onClick={handleBackdropClick}
      >
        {showCloseButton && (
          <button
            type="button"
            className="modal__close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <Icon name="close" />
          </button>
        )}
        {children}
      </dialog>
    </div>
  );
};

export default Modal;
