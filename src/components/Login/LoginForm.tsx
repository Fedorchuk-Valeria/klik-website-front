"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";

import { validationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import PasswordInput from "@/src/components/ui/PasswordInput";
import PhoneInput from "@/src/components/ui/PhoneInput";
import Tabs from "@/src/components/ui/Tabs";

import { PAGES } from "@/src/utils/constant";

const LoginForm = () => {
  const router = useRouter();
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

  const handleChangeTab = (tab: string) => {
    router.push(tab);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    void form.setFieldValue(name, value, true);
  };

  return (
    <div className="login-page__form-content">
      <Tabs
        tabs={[
          { label: "Вход", value: PAGES.LOGIN },
          { label: "Регистрация", value: PAGES.REGISTER },
        ]}
        activeTab={PAGES.LOGIN}
        onChange={handleChangeTab}
      />

      <span className="login-page__text">Войдите или зарегистрируйтесь для доступа к курсам</span>

      <form className="login-page__form" onSubmit={form.handleSubmit}>
        <PhoneInput
          name="phone"
          label="Номер телефона"
          value={form.values.phone}
          error={form.errors.phone}
          onChange={handleChange}
          placeholder="+375 (29) 123-45-67"
          className="login-page__form-input"
          variant="outline"
        />

        <PasswordInput
          name="password"
          label="Пароль"
          onChange={handleChange}
          value={form.values.password}
          error={form.errors.password}
          className="login-page__form-input"
          variant="outline"
          placeholder="********"
        />

        <Button
          withArrow
          type="submit"
          variant="main-green-dark"
          className="login-page__form-button"
        >
          Войти
        </Button>

        <Link className="login-page__form-link" href={PAGES.FORGOT_PASSWORD}>
          Забыли пароль?
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
