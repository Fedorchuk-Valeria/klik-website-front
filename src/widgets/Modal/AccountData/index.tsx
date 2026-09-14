import classNames from "classnames";
import { FC, useEffect } from "react";

import Modal from "@/src/components/ui/Modal";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import { useAppDispatch } from "@/src/store/hooks";
import { hideModal } from "@/src/store/slices/modalSlice";
import { PAGES } from "@/src/utils/constant";
import { useRouter } from "next/navigation";

type PropTypes = {
  name?: string;
  children?: {
    id: number;
    full_name: string;
  }[];
  className?: string;
  isVisible: boolean;
  autoCloseDelayMs?: number;
};

const WidgetModalAccountData: FC<PropTypes> = ({
  name,
  children,
  className,
  isVisible,
  autoCloseDelayMs,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleProfile = () => {
    dispatch(hideModal());
    router.push(PAGES.PROFILE);
  };

  const handleClose = () => {
    dispatch(hideModal());
  };

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
      <p className={"modal-account-data__title"}>Привет, {name}!</p>

      <span className="modal-account-data__description">
        К вашему родительскому профилю привязаны следующие аккаунты:
      </span>

      <ul className="modal-account-data__list">
        {children?.map((item, index) => (
          <li key={index}>
            <Icon name="disk" />
            <p>{item.full_name}</p>
          </li>
        ))}
      </ul>

      <span className="modal-account-data__description">
        Для безопасности и удобства вы можете изменить пароль любого детского аккаунта в разделе
        управления профилями.
      </span>

      <div className="modal-account-data__actions">
        <Button variant="main-green-dark" onClick={() => handleProfile()}>
          Перейти к профилям детей
        </Button>
        <Button className="modal-account-data__actions-button" onClick={() => handleClose()}>
          Позже
        </Button>
      </div>
    </Modal>
  );
};

export default WidgetModalAccountData;
