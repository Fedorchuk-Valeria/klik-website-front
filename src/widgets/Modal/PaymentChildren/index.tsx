import classNames from "classnames";
import {FC, useEffect} from "react";

import Modal from "@/src/components/ui/Modal";

import {useAppDispatch, useAppSelector} from "@/src/store/hooks";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import {hideModal} from "@/src/store/slices/modalSlice";
import {purchaseOfflinePreviewRequest, purchaseOfflineRequest} from "@/src/store/slices/corses";
import {PAGES} from "@/src/utils/constant";

type PropTypes = {
  isVisible: boolean;
  className?: string;
  childId?: number;
};

const WidgetModalPaymentChildren: FC<PropTypes> = ({className, isVisible, childId}) => {
  const dispatch = useAppDispatch();
  const { offlinePayment, isLoading } = useAppSelector((state) => state.courses);

  useEffect(() => {
    if (!isVisible) return;

    dispatch(
      purchaseOfflinePreviewRequest({
        child_id: childId,
      })
    );
  }, [isVisible, childId, dispatch]);


  if (!offlinePayment || isLoading) {
    return null;
  }

  const handlePayment = () => {

    const origin = window.location.origin;

    const profilePath = PAGES.PROFILE;

    const returnUrl = `${origin}${profilePath}`;

    dispatch(
      purchaseOfflineRequest({
        child_id: childId,
        return_url: returnUrl
      })
    );
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
          <div className="modal-payment__value">{offlinePayment?.child_full_name}</div>
        </div>

        <div className="modal-payment__row">
          <div className="modal-payment__name dotted">Сумма к оплате</div>
          <div className="modal-payment__value">
            {offlinePayment?.is_payable ? <>{offlinePayment?.amount} <Icon className="modal-payment__currency" name="ruble" /></> :  offlinePayment?.message}
          </div>
        </div>
        <div className="modal-payment-children__footer">
          {offlinePayment?.is_payable && (
            <Button
              variant="main-green-dark"
              className="modal-payment__btn"
              onClick={() => handlePayment()}
            >
              Оплатить
            </Button>)
          }
          <Button
            variant="outline-green-dark"
            className="modal-payment__btn last"
            onClick={() => handleClose()}
          >
            Отмена
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WidgetModalPaymentChildren;
