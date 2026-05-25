import classNames from "classnames";
import { FC, useState } from "react";

import Modal from "@/src/components/ui/Modal";

import { useAppDispatch } from "@/src/store/hooks";
import { Course } from "@/src/lib/getCourses";
import Button from "@/src/components/ui/Button/Button";
import { purchaseRequest } from "@/src/store/slices/corses";
import Checkbox from "@/src/components/ui/Checkbox";
import {PUBLIC_OFFER_URL} from "@/src/utils/constant";
import Icon from "@/src/components/ui/Icon/Icon";

type PropTypes = {
  course: Course;
  isVisible: boolean;
  className?: string;
};

const WidgetModalPayment: FC<PropTypes> = ({course, className, isVisible}) => {
  const dispatch = useAppDispatch();

  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = (id: number) => {
    if (!agree) {
      setError("Необходимо согласие с Договором оказания услуг");
      return;
    }

    setError("");
    dispatch(purchaseRequest(id));
  };

  return (
    <Modal
      isClose
      isCloseBg
      isVisible={isVisible}
      isHideBg={true}
      className={classNames("modal-payment", className)}
    >
      <div className="modal__title">Оплата курса</div>

      <div className="modal-payment__body">
        <div className="modal-payment__row">
          <div className="modal-payment__name">Курс</div>
          <div className="modal-payment__value">{course.title}</div>
        </div>

        <div className="modal-payment__row">
          <div className="modal-payment__name">Стоимость</div>
          <div className="modal-payment__value">
            {course.price} <Icon className="modal-payment__currency" name="ruble" />
          </div>
        </div>

        <Button
          variant="main-green-dark"
          className="modal-payment__btn"
          onClick={() => handlePayment(course.id)}
        >
          Оплатить
        </Button>

        <div className="modal-payment__agreement">
          <Checkbox
            checked={agree}
            onChange={(checked) => {
              setAgree(checked);
              if (checked) {
                setError("");
              }
            }}
          />
          <span>Я ознакомлен с <a href={PUBLIC_OFFER_URL} target="_blank">Договором услуг</a></span>
          {error && (
            <div className="modal-payment__error">
              {error}
            </div>
          )}
        </div>


      </div>
    </Modal>
  );
};

export default WidgetModalPayment;
