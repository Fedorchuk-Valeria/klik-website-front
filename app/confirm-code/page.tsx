"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { ChangeEvent } from "react";

import { confirmCodeValidationSchema } from "@/src/components/Login/validationSchema";

import Button from "@/src/components/ui/Button/Button";
import CodeInput from "@/src/components/ui/CodeInput";

const ConfirmCode = () => {
  const form = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: confirmCodeValidationSchema,
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

  const handleResendCode = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("resend code");
  };

  return (
    <div className="login-page__form-content confirm-code-page">
      <p className="login-page__form-title--red">Подтверждение номера</p>

      <span className="login-page__text">Введите код из SMS. Он действителен 2 минуты.</span>

      <form className="login-page__form" onSubmit={form.handleSubmit}>
        <CodeInput
          name="code"
          value={form.values.code}
          error={form.errors.code}
          onChange={handleChange}
          className="confirm-code-page__code-input"
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
          Не пришел код?
          <Link className="login-page__form-link" onClick={handleResendCode} href={"#"}>
            Отправить код еще раз.
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ConfirmCode;
