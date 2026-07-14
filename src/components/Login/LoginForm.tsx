"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect } from "react";

import { validationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import PasswordInput from "@/src/components/ui/PasswordInput";
import PhoneInput from "@/src/components/ui/PhoneInput";
import Tabs from "@/src/components/ui/Tabs";

import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { clearErrors, loginRequest } from "@/src/store/slices/auth";
import { PAGES } from "@/src/utils/constant";
import { AuthRedirectHelper } from "@/src/utils/helpers";
import {showModal} from "@/src/store/slices/modalSlice";
import {ModalType} from "@/src/entities/common";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, errors, isLoggedIn, user_profile } = useAppSelector((state: RootStore) => state.auth);
  const form = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(
        loginRequest({
          phone: values.phone.replace(/[\s()]/g, ""),
          password: values.password,
        })
      );
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
  });

  const handleChangeTab = (tab: string) => {
    dispatch(clearErrors());
    router.push(tab);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    void form.setFieldValue(name, value);
  };

  useEffect(() => {
    if (errors) {
      form.setFieldError("phone", errors.phone || errors.non_field_errors);
      form.setFieldError("password", errors.password || errors.non_field_errors);
    }
  }, [errors]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const notification = user_profile?.account_data_notification;

    if (notification?.show && user_profile?.profile?.full_name) {
      dispatch(
        showModal({
          modalType: ModalType.ACCOUNT_DATA,
          modalProps: {
            name: user_profile?.profile?.full_name,
            children: user_profile?.children,
          },
        })
      );
    }
  }, [dispatch, isLoggedIn, user_profile]);

  useEffect(() => {
    if (isLoggedIn) {
      const returnTo = AuthRedirectHelper.consumeAuthReturnTo();

      router.push(returnTo ?? PAGES.COURSES);
    }
  }, [isLoggedIn, router]);

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
          disabled={isLoading}
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
          disabled={isLoading}
          maxLength={64}
        />

        <Button
          withArrow
          type="submit"
          variant="main-green-dark"
          className="login-page__form-button"
          disabled={isLoading}
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
