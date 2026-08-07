"use client";

import classNames from "classnames";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect } from "react";

import { resetPasswordValidationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import TextInput from "@/src/components/ui/TextInput";

import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { forgotPasswordRequest, setCodeSent } from "@/src/store/slices/auth";
import { PAGES, QUERY_PARAMS } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";

const ResetNewPassword = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, errors, isCodeSent } = useAppSelector((state: RootStore) => state.auth);
  const form = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: (values) => {
      dispatch(
        forgotPasswordRequest({
          email: values.email,
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

  useEffect(() => {
    if (errors) {
      form.setFieldError("email", errors.email);
    }
  }, [errors]);

  useEffect(() => {
    if (isCodeSent) {
      dispatch(setCodeSent(false));

      router.push(
        PAGES.CONFIRM_CODE +
          QueryHelper.getQueryString({
            [QUERY_PARAMS.IS_RESET_PASSWORD]: "true",
          })
      );
    }
  }, [dispatch, isCodeSent, router]);

  return (
    <div className={classNames("login-page__form-content", "reset-password-page")}>
      <p className="login-page__form-title--red">Восстановление пароля</p>

      <span className="login-page__text">
        Для восстановления пароля введите Email, указанный при регистрации. Мы отправим на него
        сообщение с кодом для сброса пароля.
      </span>

      <form className="login-page__form" onSubmit={form.handleSubmit}>
        <TextInput
          name="email"
          variant="outline"
          label="E-mail"
          value={form.values.email}
          error={form.errors.email}
          onChange={handleChange}
          placeholder="example@mail.com"
          className="login-page__form-input"
          disabled={isLoading}
          maxLength={100}
        />

        <Button
          withArrow
          type="submit"
          variant="main-green-dark"
          className="login-page__form-button"
          disabled={isLoading}
        >
          Отправить код
        </Button>

        <p className="login-page__after-text">
          Вспомнили пароль?
          <Link className="login-page__form-link" href={PAGES.LOGIN}>
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetNewPassword;
