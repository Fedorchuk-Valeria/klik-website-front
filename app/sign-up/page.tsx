"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef } from "react";

import { registerValidationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import PasswordInput from "@/src/components/ui/PasswordInput";
import PhoneInput from "@/src/components/ui/PhoneInput";
import PopoverPassword from "@/src/components/ui/Popovers/PopoverPassword";
import Tabs from "@/src/components/ui/Tabs";
import TextInput from "@/src/components/ui/TextInput";

import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { clearErrors, clearRegister, registerRequest } from "@/src/store/slices/auth";
import { BRANCH_CRM_ID, PAGES } from "@/src/utils/constant";
import { AuthRedirectHelper, CookieHelper } from "@/src/utils/helpers";

const RegisterForm = () => {
  const hasRedirectedRef = useRef(false);
  const dispatch = useAppDispatch();
  const { isRegisterSuccess, isLoading, errors, isLoggedIn } = useAppSelector(
    (state: RootStore) => state.auth
  );
  const router = useRouter();
  const form = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      branch_id: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      dispatch(
        registerRequest({
          phone: values.phone,
          email: values.email,
          full_name: values.name,
          password: values.password,
          confirm_password: values.confirmPassword,
          branch_id: CookieHelper.getCookie(BRANCH_CRM_ID),
        })
      );
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
  });

  const handleChangeTab = (tab: string) => {
    dispatch(clearErrors());
    router.push(AuthRedirectHelper.withReturnToQuery(tab));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    void form.setFieldValue(name, value);
  };

  const handleBlur = (name: keyof typeof form.values) => {
    void form.setFieldValue(name, String(form?.values?.[name])?.trim());
  };
  useEffect(() => {
    if (isRegisterSuccess) {
      dispatch(clearRegister());

      router.push(PAGES.CONFIRM_CODE);
    }
  }, [isRegisterSuccess, dispatch]);

  useEffect(() => {
    if (!isLoggedIn || hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    const returnTo = AuthRedirectHelper.consumeAuthReturnTo();

    router.push(returnTo ?? PAGES.PROFILE);
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (errors) {
      form.setFieldError("email", errors.email);
      form.setFieldError("phone", errors.phone);
      form.setFieldError("name", errors.full_name);
      form.setFieldError("password", errors.password);
      form.setFieldError("confirmPassword", errors.confirm_password);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

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
          className="login-page__form-input"
          disabled={isLoading}
          isAbsoluteError
        />

        <TextInput
          name="email"
          label="Email"
          variant="outline"
          onChange={handleChange}
          value={form.values.email}
          error={form.errors.email}
          placeholder="example@mail.com"
          onBlur={() => handleBlur("email")}
          disabled={isLoading}
          maxLength={100}
          isAbsoluteError
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
          maxLength={100}
          isAbsoluteError
        />

        <PasswordInput
          name="password"
          label={
            <span className="login-page__form-label">
              <span>Пароль</span>
              <PopoverPassword />
            </span>
          }
          variant="outline"
          placeholder="********"
          onChange={handleChange}
          value={form.values.password}
          error={form.errors.password}
          className="login-page__form-input"
          disabled={isLoading}
          maxLength={64}
          isAbsoluteError
        />

        <PasswordInput
          name="confirmPassword"
          label="Подтвердите пароль"
          onChange={handleChange}
          value={form.values.confirmPassword}
          error={form.errors.confirmPassword}
          className="login-page__form-input"
          variant="outline"
          placeholder="********"
          disabled={isLoading}
          maxLength={64}
          isAbsoluteError
        />

        <Button
          withArrow
          type="submit"
          variant="main-green-dark"
          className="login-page__form-button"
          style={form.errors.confirmPassword ? { marginTop: "30px" } : undefined}
          disabled={isLoading}
        >
          Получить код подтверждения
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
