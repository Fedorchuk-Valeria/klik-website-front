"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";

import { registerValidationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import PasswordInput from "@/src/components/ui/PasswordInput";
import PhoneInput from "@/src/components/ui/PhoneInput";
import Popover from "@/src/components/ui/Popover";
import Tabs from "@/src/components/ui/Tabs";
import TextInput from "@/src/components/ui/TextInput";

import { PAGES, PASSWORD_INPUT_STRIP_REGEX } from "@/src/utils/constant";

const RegisterForm = () => {
  const router = useRouter();
  const form = useFormik({
    initialValues: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerValidationSchema,
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

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const filtered = value.replace(PASSWORD_INPUT_STRIP_REGEX, "");

    void form.setFieldValue(name, filtered, true);
  };

  return (
    <div className="login-page__form-content">
      <Tabs
        tabs={[
          { label: "Вход", value: PAGES.LOGIN },
          { label: "Регистрация", value: PAGES.REGISTER },
        ]}
        activeTab={PAGES.REGISTER}
        onChange={handleChangeTab}
      />

      <span className="login-page__text">Войдите или зарегистрируйтесь для доступа к курсам</span>

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

        <TextInput
          name="name"
          label="ФИО"
          variant="outline"
          onChange={handleChange}
          value={form.values.name}
          error={form.errors.name}
          placeholder="Иванов Иван Иванович"
          className="login-page__form-input"
        />

        <PasswordInput
          name="password"
          label={
            <span className="login-page__form-label">
              <span>Пароль</span>
              <Popover
                id="password-popover"
                variant="click"
                positionX="right"
                positionY="bottom-end"
                popoverClassName="password-popover-list"
                content={
                  <ul>
                    <li>Минимальная длина - 8 символов.</li>
                    <li>Должна быть минимум 1 заглавная буква.</li>
                    <li>Должна быть минимум 1 строчная буква.</li>
                    <li>Должен быть минимум 1 специальный символ.</li>
                    <li>Должна быть минимум 1 цифра.</li>
                  </ul>
                }
              >
                <Icon name="info-circle-outline" />
              </Popover>
            </span>
          }
          variant="outline"
          placeholder="********"
          onChange={handlePasswordChange}
          value={form.values.password}
          error={form.errors.password}
          className="login-page__form-input"
        />

        <PasswordInput
          name="confirmPassword"
          label="Подтвердите пароль"
          onChange={handlePasswordChange}
          value={form.values.confirmPassword}
          error={form.errors.confirmPassword}
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
          Получить код подтверждения
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
