import classNames from "classnames";
import {ChangeEvent, FC, useState} from "react";

import Modal from "@/src/components/ui/Modal";

import { useAppDispatch } from "@/src/store/hooks";
import Button from "@/src/components/ui/Button/Button";
import {PASSWORD_INPUT_STRIP_REGEX} from "@/src/utils/constant";
import PasswordInput from "@/src/components/ui/PasswordInput";
import PopoverPassword from "@/src/components/ui/Popovers/PopoverPassword";
import {useFormik} from "formik";
import {setNewPasswordValidationSchema} from "@/src/components/Login/validationSchema";
import {hideModal} from "@/src/store/slices/modalSlice";
import TextInput from "@/src/components/ui/TextInput";
import PhoneInput from "@/src/components/ui/PhoneInput";

type PropTypes = {
  isVisible: boolean;
  className?: string;
};

const WidgetModalCreateChildren: FC<PropTypes> = ({className, isVisible}) => {
  const dispatch = useAppDispatch();

  const form = useFormik({
    initialValues: {
      fio: "",
      phone: "",
      password: "",
      date: "",
    },
    validationSchema: setNewPasswordValidationSchema,
    onSubmit: (values) => {
      console.log('values=', values);
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
  });

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const filtered = value.replace(PASSWORD_INPUT_STRIP_REGEX, "");

    void form.setFieldValue(name, filtered, true);
  };

  const handleBack = () => {
    dispatch(hideModal());
  };

  return (
    <Modal
      isClose
      isVisible={isVisible}
      isHideBg={true}
      className={classNames("modal-children", className)}
      showCloseButton={true}
    >
      <div className="modal__title">Создать профиль ребёнка</div>

      <div className="modal-children__body">
        <form className="" onSubmit={form.handleSubmit}>
          <TextInput
            variant="outline"
            label="ФИО Ребенка"
            value={form.values.fio}
            error={form.errors.fio}
            required={true}
            className="login-page__form-input"
            placeholder="Иванов Иван Иванович"
          />
          <PhoneInput
            name="phone"
            variant="outline"
            label="Номер телефона"
            value={form.values.phone}
            error={form.errors.phone}
            placeholder="+375 (29) 123-45-67"
            className="login-page__form-input"
            required={true}
          />
          <div className="page-profile__row-form landscape">
            <PasswordInput
              name="password"
              variant="outline"
              label={
                <span className="page-profile__form-label">
                    <span>Пароль</span>
                    <PopoverPassword />
                  </span>
              }
              placeholder="********"
              onChange={handlePasswordChange}
              value={form.values.password}
              error={form.errors.password}
              className="login-page__form-input"
            />
            <TextInput
              variant="outline"
              label="Дата рождения ребёнка"
              value={form.values.date}
              error={form.errors.date}
              required={true}
              className="login-page__form-input"
              placeholder="ДД/ММ/ГГ"
            />
          </div>
          <div className="page-profile__row-form">
            <Button
              withArrow
              type="submit"
              variant="main-green-dark"
              className="page-profile__button"
            >
              Создать
            </Button>
            <Button variant='outline-green-dark' onClick={handleBack}>Отмена</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default WidgetModalCreateChildren;
