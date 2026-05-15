"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { ChangeEvent } from "react";

import { validationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import PhoneInput from "@/src/components/ui/PhoneInput";

import { PAGES } from "@/src/utils/constant";

const LoginForm = () => {
  const form = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
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
    <div className="login-page__content">
      <div>АВТОРИЗАЦИЯ / РЕГИСТРАЦИЯ</div>
      <span>Войдите или зарегистрируйтесь для доступа к курсам</span>

      <form className="login-page__form" onSubmit={form.handleSubmit}>
        <PhoneInput
          name="phone"
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
          Войти
        </Button>

        <Link href={PAGES.FORGOT_PASSWORD}>Забыли пароль?</Link>
      </form>
    </div>
  );
};

export default LoginForm;
