import classNames from "classnames";
import { FC } from "react";

import Modal from "@/src/components/ui/Modal";

import { useAppDispatch } from "@/src/store/hooks";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import {hideModal} from "@/src/store/slices/modalSlice";

type PropTypes = {
  isVisible: boolean;
  className?: string;
};

const WidgetModalPaymentChildren: FC<PropTypes> = ({className, isVisible}) => {
  const dispatch = useAppDispatch();

  const handlePayment = () => {
    /*dispatch(
      purchaseRequest({
        course_id: id,
        return_url: returnUrl
      })
    );*/
  };

  const handleClose = () => {
    dispatch(hideModal());
  };

  return (
    <Modal
      isClose
      isVisible={isVisible}
      isHideBg={true}
      className={classNames("modal-payment-children", className)}
      showCloseButton={true}
    >
      <div className="modal__title">Оплатить обучение</div>

      <div className="modal-payment__body">
        <div className="modal-payment__row">
          <div className="modal-payment__name">Обучение для</div>
          <div className="modal-payment__value">Фамилия Имя Отчество Ребёнка</div>
        </div>

        <div className="modal-payment__row">
          <div className="modal-payment__name dotted">Сумма к оплате</div>
          <div className="modal-payment__value">
            610 <Icon className="modal-payment__currency" name="ruble" />
          </div>
        </div>

        <Button
          variant="main-green-dark"
          className="modal-payment__btn"
          onClick={() => handlePayment()}
        >
          Оплатить
        </Button>
        <Button
          variant="outline-green-dark"
          className="modal-payment__btn last"
          onClick={() => handleClose()}
        >
          Отмена
        </Button>
      </div>
    </Modal>
  );
};

export default WidgetModalPaymentChildren;
