import classNames from "classnames";
import { FC, useEffect } from "react";

import Modal from "@/src/components/ui/Modal";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import { useAppDispatch } from "@/src/store/hooks";
import { hideModal } from "@/src/store/slices/modalSlice";

type PropTypes = {
  // name: string;
  // childs: string[];
  className?: string;
  isVisible: boolean;
  autoCloseDelayMs?: number;
};

const WidgetModalAccountData: FC<PropTypes> = ({
  // name,
  // childs,
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
      className={classNames("modal-account-data", className)}
    >
      <p className={"modal-account-data__title"}>Привет, Имя Фамилия</p>

      <span className="modal-account-data__description">
        К вашему родительскому профилю привязаны следующие аккаунты:
      </span>

      <ul className="modal-account-data__list">
        {[...new Array(3)].map((_, index) => (
          <li key={index}>
            <Icon name="disk" />
            <p>{`Фамилия Имя Отчество Ребёнка 0${index + 1}`}</p>
          </li>
        ))}
      </ul>

      <span className="modal-account-data__description">
        Для безопасности и удобства вы можете изменить пароль любого детского аккаунта в разделе
        управления профилями.
      </span>

      <div className="modal-account-data__actions">
        <Button variant="main-green-dark">Перейти к профилям детей</Button>
        <Button className="modal-account-data__actions-button">Позже</Button>
      </div>
    </Modal>
  );
};

export default WidgetModalAccountData;
