"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect } from "react";

import { setNewPasswordValidationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import PasswordInput from "@/src/components/ui/PasswordInput";

import { ModalType } from "@/src/entities/common";
import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { resetPasswordRequest } from "@/src/store/slices/auth";
import { showModal } from "@/src/store/slices/modalSlice";
import { PAGES, PASSWORD_INPUT_STRIP_REGEX, TOKEN_KEY } from "@/src/utils/constant";
import { CookieHelper } from "@/src/utils/helpers";

const SetNewPasswordForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, errors, isResetPasswordSuccess } = useAppSelector(
    (state: RootStore) => state.auth
  );

  const form = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: setNewPasswordValidationSchema,
    onSubmit: (values) => {
      const sessionToken = CookieHelper.getCookie(TOKEN_KEY);

      if (sessionToken) {
        dispatch(
          resetPasswordRequest({
            password: values.password,
            session_token: sessionToken,
            confirm_password: values.confirmPassword,
          })
        );
      }
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
    if (isResetPasswordSuccess) {
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

      router.push(PAGES.COURSES);
    }
  }, [isResetPasswordSuccess]);

  return (
    <div className="login-page__form-content">
      <p className="login-page__form-title--red">Создайте новый пароль</p>

      <form className="login-page__form" onSubmit={form.handleSubmit}>
        <PasswordInput
          name="password"
          variant="outline"
          label="Новый пароль"
          placeholder="********"
          onChange={handlePasswordChange}
          value={form.values.password}
          error={form.errors.password}
          className="login-page__form-input"
          disabled={isLoading}
        />

        <PasswordInput
          variant="outline"
          name="confirmPassword"
          placeholder="********"
          label="Подтвердите пароль"
          onChange={handlePasswordChange}
          value={form.values.confirmPassword}
          error={form.errors.confirmPassword}
          className="login-page__form-input"
          disabled={isLoading}
        />

        <Button
          withArrow
          type="submit"
          variant="main-green-dark"
          className="login-page__form-button"
          disabled={isLoading}
        >
          Сохранить пароль
        </Button>
      </form>
    </div>
  );
};

export default SetNewPasswordForm;
