"use client";

import classNames from "classnames";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";

import { resetPasswordValidationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import PhoneInput from "@/src/components/ui/PhoneInput";

import { PAGES, QUERY_PARAMS } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";

const ResetNewPassword = () => {
  const router = useRouter();
  const form = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      router.push(
        PAGES.CONFIRM_CODE +
          QueryHelper.getQueryString({ [QUERY_PARAMS.PHONE]: values.phone.replace(/[\s()]/g, "") })
      );
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    void form.setFieldValue(name, value, true);
  };

  return (
    <div className={classNames("login-page__form-content", "reset-password-page")}>
      <p className="login-page__form-title--red">Восстановление пароля</p>

      <span className="login-page__text">
        Для восстановления пароля введите номер телефона, указанный при регистрации. Мы отправим SMS
        с кодом для сброса пароля.
      </span>

      <form className="login-page__form" onSubmit={form.handleSubmit}>
        <PhoneInput
          name="phone"
          variant="outline"
          label="Номер телефона"
          value={form.values.phone}
          error={form.errors.phone}
          onChange={handleChange}
          placeholder="+375 (29) 123-45-67"
          className="login-page__form-input"
        />

        <Button
          withArrow
          type="submit"
          variant="main-green-dark"
          className="login-page__form-button"
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
