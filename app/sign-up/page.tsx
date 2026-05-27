"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect } from "react";

import { registerValidationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import PasswordInput from "@/src/components/ui/PasswordInput";
import PhoneInput from "@/src/components/ui/PhoneInput";
import Popover from "@/src/components/ui/Popover";
import Tabs from "@/src/components/ui/Tabs";
import TextInput from "@/src/components/ui/TextInput";

import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { clearRegister, registerRequest } from "@/src/store/slices/auth";
import { PAGES, PASSWORD_INPUT_STRIP_REGEX } from "@/src/utils/constant";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const { isRegisterSuccess, isLoading, errors } = useAppSelector((state: RootStore) => state.auth);
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
      dispatch(
        registerRequest({
          phone: values.phone,
          full_name: values.name,
          password: values.password,
          confirm_password: values.confirmPassword,
        })
      );
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

  const handleBlur = (name: keyof typeof form.values) => {
    void form.setFieldValue(name, String(form?.values?.[name])?.trim());
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const filtered = value.replace(PASSWORD_INPUT_STRIP_REGEX, "");

    void form.setFieldValue(name, filtered, true);
  };

  useEffect(() => {
    if (isRegisterSuccess) {
      dispatch(clearRegister());

      router.push(PAGES.CONFIRM_CODE);
    }
  }, [isRegisterSuccess, dispatch]);

  useEffect(() => {
    if (errors) {
      form.setFieldError("phone", errors.phone);
      form.setFieldError("name", errors.full_name);
      form.setFieldError("password", errors.password);
      form.setFieldError("confirmPassword", errors.confirm_password);
    }
  }, [errors, form]);

  return (
    <div className="login-page__form-content">
      <Tabs
        tabs={[
          { label: "Вход", value: PAGES.LOGIN },
          { label: "Регистрация", value: PAGES.SIGN_UP },
        ]}
        activeTab={PAGES.SIGN_UP}
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
          disabled={isLoading}
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
          onBlur={() => handleBlur("name")}
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
        />

        <Button
          withArrow
          type="submit"
          variant="main-green-dark"
          className="login-page__form-button"
          disabled={isLoading}
        >
          Получить код подтверждения
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
