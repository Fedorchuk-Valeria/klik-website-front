"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect } from "react";

import { setNewPasswordValidationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import ButtonBack from "@/src/components/ui/ButtonBack/ButtonBack";
import PasswordInput from "@/src/components/ui/PasswordInput";
import PopoverPassword from "@/src/components/ui/Popovers/PopoverPassword";

import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { changePasswordRequest, clearPasswordChanged } from "@/src/store/slices/auth";
import { showModal } from "@/src/store/slices/modalSlice";

import { ModalType } from "@/src/entities/common";
import { PAGES, PASSWORD_INPUT_STRIP_REGEX } from "@/src/utils/constant";

const PagesProfilePassword = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, errors, isPasswordChanged } = useAppSelector((state: RootStore) => state.auth);

  const form = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: setNewPasswordValidationSchema,
    onSubmit: (values) => {
      dispatch(
        changePasswordRequest({
          password: values.password,
          confirm_password: values.confirmPassword,
        })
      );
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

  useEffect(() => {
    if (errors) {
      form.setFieldError("password", errors.password);
      form.setFieldError("confirmPassword", errors.confirm_password);
    }
  }, [errors]);

  useEffect(() => {
    return () => {
      dispatch(clearPasswordChanged());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isPasswordChanged) {
      dispatch(
        showModal({
          modalType: ModalType.SUCCESSFULLY,
          modalProps: {
            autoCloseDelayMs: 5000,
            type: "success",
            icon: "success-circle",
            text: "Пароль успешно изменен!",
          },
        })
      );

      dispatch(clearPasswordChanged());

      router.push(PAGES.PROFILE);
    }
  }, [isPasswordChanged, dispatch, router]);

  const handleBack = () => {
    router.push(PAGES.PROFILE);
  };

  return (
    <div className="page-profile">
      <div className="platform-layout__container">
        <div className="page-profile__content">
          <ButtonBack
            label="Вернуться в личный профиль"
            className="page-profile__back"
            onClick={handleBack}
          />
          <div className="page-profile__header">
            <h1>Изменить пароль</h1>
          </div>
          <form className="page-profile__form password" onSubmit={form.handleSubmit}>
            <PasswordInput
              name="password"
              variant="outline"
              label={
                <span className="page-profile__form-label">
                  <span>Новый пароль</span>
                  <PopoverPassword />
                </span>
              }
              placeholder="********"
              onChange={handlePasswordChange}
              value={form.values.password}
              error={form.errors.password}
              className="login-page__form-input"
              disabled={isLoading}
              maxLength={64}
            />

            <PasswordInput
              variant="outline"
              name="confirmPassword"
              placeholder="********"
              label="Подтвердите новый пароль"
              onChange={handlePasswordChange}
              value={form.values.confirmPassword}
              error={form.errors.confirmPassword}
              className="login-page__form-input"
              disabled={isLoading}
              maxLength={64}
            />

            <div className="page-profile__row-form">
              <Button
                withArrow
                type="submit"
                variant="main-green-dark"
                className="page-profile__button"
                disabled={isLoading}
              >
                Сохранить изменения
              </Button>
              <Button variant="outline-green-dark" onClick={handleBack}>
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PagesProfilePassword;
