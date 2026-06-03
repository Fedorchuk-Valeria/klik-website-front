import classNames from "classnames";
import { FC } from "react";

import Modal from "@/src/components/ui/Modal";

import Button from "@/src/components/ui/Button/Button";
import {useAppDispatch} from "@/src/store/hooks";
import {hideModal} from "@/src/store/slices/modalSlice";
import {CitySettings} from "@/src/lib/getCitySettings";
import {phoneToLink} from "@/src/lib/utils/phoneLink";

type PropTypes = {
  status?: string
  isVisible: boolean;
  className?: string;
  settings?: CitySettings;
};

const WidgetModalPaymentStatus: FC<PropTypes> = ({status, settings, className, isVisible}) => {
  const dispatch = useAppDispatch();
  const phone = settings?.phone ?? "";

  const title = status == 'success' ? 'Оплата прошла успешно!' : 'К сожалению, по техническим причинам оплата не удалась';
  const description =
    status === "success" ? null : (
      <>
        Просим Вас связаться с нашей службой по телефону{" "}<br />
        <a href={phoneToLink(phone)}>{phone}</a>
      </>
    );

  const handleOk = () => {
    dispatch(hideModal());
  };

  return (
    <Modal
      isClose
      isVisible={isVisible}
      isHideBg={true}
      className={classNames("modal-payment modal-payment-status", className, status)}
    >
      <div className="modal__title">{title}</div>
      <div className="modal-payment__body">

        {description}

        <Button
          variant="main-green-dark"
          className="modal-payment__btn"
          onClick={handleOk}
        >
          Ок
        </Button>

      </div>
    </Modal>
  );
};

export default WidgetModalPaymentStatus;
