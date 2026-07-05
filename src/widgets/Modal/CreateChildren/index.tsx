import classNames from "classnames";
import { useFormik } from "formik";
import { ChangeEvent, FC, useEffect } from "react";

import { createChildValidationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import DateInput from "@/src/components/ui/DateInput";
import Modal from "@/src/components/ui/Modal";
import PasswordInput from "@/src/components/ui/PasswordInput";
import PhoneInput from "@/src/components/ui/PhoneInput";
import PopoverPassword from "@/src/components/ui/Popovers/PopoverPassword";
import TextInput from "@/src/components/ui/TextInput";

import { ModalType } from "@/src/entities/common";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { clearChildSuccessfullyCreated, createChildRequest } from "@/src/store/slices/auth";
import { hideModal, showModal } from "@/src/store/slices/modalSlice";
import { PASSWORD_INPUT_STRIP_REGEX } from "@/src/utils/constant";

type PropTypes = {
  isVisible: boolean;
  className?: string;
};

const WidgetModalCreateChildren: FC<PropTypes> = ({ className, isVisible }) => {
  const dispatch = useAppDispatch();
  const {
    isChildSuccessfullyCreated,
    isCreateChildLoading,
    errors: childErrors,
  } = useAppSelector((state) => state.auth);

  const form = useFormik({
    initialValues: {
      name: "",
      phone: "",
      password: "",
      date: "",
    },
    validationSchema: createChildValidationSchema,
    onSubmit: (values) => {
      console.log("values=", values);

      dispatch(
        createChildRequest({
          phone: values.phone,
          full_name: values.name,
          birth_date: values.date,
          password: values.password,
        })
      );
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    void form.setFieldValue(name, value);
  };

  const handleBlur = (name: keyof typeof form.values) => {
    void form.setFieldValue(name, String(form?.values?.[name])?.trim());
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const filtered = value.replace(PASSWORD_INPUT_STRIP_REGEX, "");

    void form.setFieldValue(name, filtered);
  };

  const handleBack = () => {
    dispatch(hideModal());
  };

  useEffect(() => {
    if (isChildSuccessfullyCreated) {
      dispatch(clearChildSuccessfullyCreated());
      dispatch(
        showModal({
          modalType: ModalType.SUCCESSFULLY,
          modalProps: {
            autoCloseDelayMs: 3000,
            type: "success",
            icon: "success-circle",
            text: "Профиль ребёнка успешно создан",
          },
        })
      );
    }
  }, [isChildSuccessfullyCreated, dispatch]);

  useEffect(() => {
    if (childErrors) {
      form.setFieldError("phone", childErrors.phone);
      form.setFieldError("name", childErrors.full_name);
      form.setFieldError("date", childErrors.birth_date);
      form.setFieldError("password", childErrors.password);
    }
  }, [childErrors, dispatch]);

  useEffect(() => {
    if (isVisible) {
      form.resetForm();
    }
  }, [isVisible]);

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
        <form onSubmit={form.handleSubmit}>
          <TextInput
            name="name"
            variant="outline"
            label="ФИО Ребенка"
            value={form.values.name}
            error={form.errors.name}
            required={true}
            className="login-page__form-input"
            placeholder="Иванов Иван Иванович"
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            maxLength={100}
            disabled={isCreateChildLoading}
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
            onChange={handleChange}
            disabled={isCreateChildLoading}
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
              maxLength={64}
              disabled={isCreateChildLoading}
            />

            <DateInput
              name="date"
              variant="outline"
              label="Дата рождения ребёнка"
              value={form.values.date}
              error={form.errors.date}
              required={true}
              className="login-page__form-input"
              onChange={handleChange}
              disabled={isCreateChildLoading}
            />
          </div>

          <div className="page-profile__row-form column">
            <Button
              withArrow
              type="submit"
              variant="main-green-dark"
              className="modal-children__create"
              disabled={isCreateChildLoading}
            >
              Создать
            </Button>

            <Button
              variant="outline-green-dark"
              className="modal-children__cancel"
              onClick={handleBack}
              disabled={isCreateChildLoading}
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default WidgetModalCreateChildren;
