"use client";

import { useFormik } from "formik";
import { ChangeEvent } from "react";

import { setNewPasswordValidationSchema } from "@/src/components/Login/validationSchema";
import PasswordInput from "@/src/components/ui/PasswordInput";

import Button from "@/src/components/ui/Button/Button";
import { PASSWORD_INPUT_STRIP_REGEX } from "@/src/utils/constant";

const SetNewPasswordForm = () => {
  const form = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: setNewPasswordValidationSchema,
    onSubmit: (values) => {
      console.log(values);
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
        />

        <Button
          withArrow
          type="submit"
          variant="main-green-dark"
          className="login-page__form-button"
        >
          Сохранить пароль
        </Button>
      </form>
    </div>
  );
};

export default SetNewPasswordForm;
