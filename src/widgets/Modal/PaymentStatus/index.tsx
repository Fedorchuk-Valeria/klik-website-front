import classNames from "classnames";
import { FC } from "react";

import Modal from "@/src/components/ui/Modal";

import Button from "@/src/components/ui/Button/Button";
import {useAppDispatch} from "@/src/store/hooks";
import {hideModal} from "@/src/store/slices/modalSlice";
import {CitySettings} from "@/src/lib/getCitySettings";
import {phoneToLink} from "@/src/lib/utils/phoneLink";
import {PAYMENT_STATUS_SUCCESSFULL} from "@/src/utils/constant";
import {CoursePayment} from "@/src/lib/getCourses";

type PropTypes = {
  payment?: CoursePayment
  isVisible: boolean;
  className?: string;
  settings?: CitySettings;
};

const WidgetModalPaymentStatus: FC<PropTypes> = ({payment, settings, className, isVisible}) => {
  const dispatch = useAppDispatch();
  const phone = settings?.phone ?? "";
  const status = payment?.status;

  const title = status == PAYMENT_STATUS_SUCCESSFULL ? 'Оплата прошла успешно!' : 'К сожалению, по техническим причинам оплата не удалась';
  const description =
    status === PAYMENT_STATUS_SUCCESSFULL ? null : (
      <>
        Просим Вас связаться с нашей службой по телефону{" "}<br />
        <a href={phoneToLink(phone)}>{phone}</a>
      </>
    );

  const handleOk = () => {
    dispatch(hideModal());
  };

  const handleDownload = () => {
    if (!payment?.download_url) {
      return;
    }
    window.open(payment.download_url, "_blank");
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

        {status === PAYMENT_STATUS_SUCCESSFULL && <Button
          variant="outline-orange"
          className="modal-payment__btn last"
          onClick={handleDownload}
        >
          Скачать чек
        </Button>}

      </div>
    </Modal>
  );
};

export default WidgetModalPaymentStatus;
