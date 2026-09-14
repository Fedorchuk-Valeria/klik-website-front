"use client";

import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect } from "react";

import { setNewPasswordValidationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import ButtonBack from "@/src/components/ui/ButtonBack/ButtonBack";
import PasswordInput from "@/src/components/ui/PasswordInput";
import PopoverPassword from "@/src/components/ui/Popovers/PopoverPassword";

import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  changePasswordChildRequest,
  changePasswordRequest,
  clearPasswordChanged,
} from "@/src/store/slices/auth";
import { showModal } from "@/src/store/slices/modalSlice";

import { ModalType } from "@/src/entities/common";
import { PAGES } from "@/src/utils/constant";
import classNames from "classnames";

const PagesProfilePassword = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, errors, isPasswordChanged } = useAppSelector((state: RootStore) => state.auth);

  const { id } = useParams<{ id: string }>();

  const form = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: setNewPasswordValidationSchema,
    onSubmit: (values) => {
      const payload = {
        password: values.password,
        confirm_password: values.confirmPassword,
        id: id,
      };

      if (id) {
        dispatch(changePasswordChildRequest(payload));
      } else {
        dispatch(changePasswordRequest(payload));
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
  });

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    void form.setFieldValue(name, value, true);
  };

  const handleBack = useCallback(() => {
    if (id) {
      router.push(PAGES.PROFILE_CHILDREN_DETAILS.replace(":id", String(id)));
    } else {
      router.push(PAGES.PROFILE);
    }
  }, [id, router]);

  useEffect(() => {
    if (errors) {
      form.setFieldError("password", errors.password);
      form.setFieldError("confirmPassword", errors.confirm_password);
    }
  }, [errors]);

  useEffect(() => {
    return () => {
      dispatch(clearPasswordChanged());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isPasswordChanged) {
      dispatch(
        showModal({
          modalType: ModalType.SUCCESSFULLY,
          modalProps: {
            autoCloseDelayMs: 5000,
            type: "success",
            icon: "success-circle",
            text: "Пароль успешно изменен!",
          },
        })
      );

      dispatch(clearPasswordChanged());

      handleBack();
    }
  }, [isPasswordChanged, dispatch, router, handleBack]);

  return (
    <div className={classNames("page-profile", "change-password")}>
      <div className="platform-layout__container">
        <div className="page-profile__content">
          <ButtonBack
            label={id ? "Вернуться к профилю ребенка" : "Вернуться в личный профиль"}
            className="page-profile__back"
            onClick={handleBack}
          />

          <div className="page-profile__header">
            <h1>{id ? "Изменить пароль ребенка" : "Изменить пароль"}</h1>
          </div>

          <form
            className={classNames("page-profile__form", "password", "change-password__form")}
            onSubmit={form.handleSubmit}
          >
            <PasswordInput
              name="password"
              variant="outline"
              label={
                <span className="page-profile__form-label">
                  <span>Новый пароль</span>
                  <PopoverPassword />
                </span>
              }
              placeholder="********"
              onChange={handlePasswordChange}
              value={form.values.password}
              error={form.errors.password}
              className="login-page__form-input"
              disabled={isLoading}
              maxLength={64}
            />

            <PasswordInput
              variant="outline"
              name="confirmPassword"
              placeholder="********"
              label="Подтвердите новый пароль"
              onChange={handlePasswordChange}
              value={form.values.confirmPassword}
              error={form.errors.confirmPassword}
              className="login-page__form-input"
              disabled={isLoading}
              maxLength={64}
            />

            <div className="change-password__buttons">
              <Button
                withArrow
                type="submit"
                variant="main-green-dark"
                className="change-password__button"
                disabled={isLoading}
              >
                Сохранить изменения
              </Button>

              <Button
                className="change-password__button"
                variant="outline-green-dark"
                onClick={handleBack}
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PagesProfilePassword;
