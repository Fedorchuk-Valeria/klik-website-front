import classNames from "classnames";
import { FC } from "react";

import Modal from "@/src/components/ui/Modal";

import Button from "@/src/components/ui/Button/Button";
import { useAppDispatch } from "@/src/store/hooks";
import { hideModal } from "@/src/store/slices/modalSlice";

type PropTypes = {
  name?: string;
  course_title?: string;
  className?: string;
  isVisible: boolean;
  onClose?: () => void;
};

const WidgetModalNotificationFreeCourse: FC<PropTypes> = ({
  name,
  course_title,
  className,
  isVisible,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(hideModal());
    onClose?.();
  };

  return (
    <Modal isClose isVisible={isVisible} className={classNames("modal-account-data", className)}>
      {!!name && <p className={"modal-account-data__title"}>Привет, {name}!</p>}

      <span className="modal-account-data__description center">
        Добро пожаловать на платформу!
        <br />
        <br />
        Мы подготовили для вас бесплатный курс «{course_title}», который поможет познакомиться с
        обучением и сделать первые шаги в IT.
      </span>

      <div className="modal-account-data__actions">
        <Button variant="main-green-dark" onClick={() => handleClose()}>
          Ок
        </Button>
      </div>
    </Modal>
  );
};

export default WidgetModalNotificationFreeCourse;
