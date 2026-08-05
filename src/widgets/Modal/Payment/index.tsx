import classNames from "classnames";
import { FC, MouseEvent, useState } from "react";

import Modal from "@/src/components/ui/Modal";

import Button from "@/src/components/ui/Button/Button";
import Checkbox from "@/src/components/ui/Checkbox";
import Icon from "@/src/components/ui/Icon/Icon";
import { Course } from "@/src/lib/getCourses";
import { useAppDispatch } from "@/src/store/hooks";
import { purchaseRequest } from "@/src/store/slices/corses";
import { PAGES, PUBLIC_OFFER_URL } from "@/src/utils/constant";

type PropTypes = {
  course: Course;
  isVisible: boolean;
  className?: string;
};

const WidgetModalPayment: FC<PropTypes> = ({ course, className, isVisible }) => {
  const dispatch = useAppDispatch();
  const origin = window.location.origin;

  const coursePath = PAGES.COURSE.replace(":id", String(course.id));

  const returnUrl = `${origin}${coursePath}`;

  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handleOpenPublicOffer = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    window.open(`${origin}${PUBLIC_OFFER_URL}`, "_blank", "noopener,noreferrer");
  };

  const handlePayment = (id: number) => {
    if (!agree) {
      setError("Необходимо согласие с Договором оказания услуг");
      return;
    }

    setError("");
    dispatch(
      purchaseRequest({
        course_id: id,
        return_url: returnUrl,
      })
    );
  };

  return (
    <Modal
      isClose
      isVisible={isVisible}
      isHideBg={true}
      className={classNames("modal-payment", className)}
      showCloseButton={true}
    >
      <div className="modal__title">Оплата курса</div>

      <div className="modal-payment__body">
        <div className="modal-payment__row">
          <div className="modal-payment__name">Курс</div>
          <div className="modal-payment__value">{course.title}</div>
        </div>

        <div className="modal-payment__row">
          <div className="modal-payment__name dotted">Стоимость</div>
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

          <span>
            Я ознакомлен с{" "}
            <a
              href={`${origin}${PUBLIC_OFFER_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenPublicOffer}
            >
              Договором услуг
            </a>
          </span>

          {error && <div className="modal-payment__error">{error}</div>}
        </div>
      </div>
    </Modal>
  );
};

export default WidgetModalPayment;
