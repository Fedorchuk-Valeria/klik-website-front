"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

import Button from "@/src/components/ui/Button/Button";
import Checkbox from "@/src/components/ui/Checkbox";
import DateInput from "@/src/components/ui/DateInput";
import PhoneInput from "@/src/components/ui/PhoneInput";
import TextInput from "@/src/components/ui/TextInput";

import { ModalType } from "@/src/entities/common";
import { useAppDispatch } from "@/src/store/hooks";
import { showModal } from "@/src/store/slices/modalSlice";
import { API_URL } from "@/src/utils/constant";

import { validationSchema } from "./validationSchema";

const MAX_TEXT_FIELD_LENGTH = 100;

function normalizePhoneForApi(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

const HomePageForm = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);
  const form = useFormik({
    initialValues: {
      parent: "",
      child: "",
      phone: "",
      date: "",
      agreedment: false,
    },
    validationSchema,
    onSubmit: (values) => {
      if (!values.agreedment) {
        form.setFieldError(
          "agreedment",
          "Пожалуйста, согласитесь с политикой обработки конфиденциальных данных"
        );
      } else {
        setLoading(true);

        fetch(`${API_URL}users/lead/?branch=${getCurrentBranch()}`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            legal_name: values.parent,
            name: values.child,
            phone: normalizePhoneForApi(values.phone),
            dob: values.date,
          }),
        })
          .then(() => {
            form.resetForm();

            dispatch(
              showModal({
                modalType: ModalType.NOTICE,
                modalProps: {
                  isHideBg: true,
                  title: "Заявка принята!",
                  description: "Менеджер свяжется с вами в ближайщее время",
                  autoCloseDelayMs: 3000,
                },
              })
            );
          })
          .catch((error) => {
            console.error(error);

            dispatch(
              showModal({
                modalType: ModalType.NOTICE,
                modalProps: {
                  isHideBg: true,
                  title: "Ошибка отправки ...",
                  description: "Попробуйте позже",
                  autoCloseDelayMs: 3000,
                },
              })
            );
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    form.handleChange(e);
    form.validateField(e.target.name);
  };

  const handleBlur = (name: keyof typeof form.values) => () => {
    form.setFieldValue(name, String(form?.values?.[name])?.trim());
  };

  return (
    <form className="home-page__form-body" onSubmit={form.handleSubmit}>
      <TextInput
        required
        max={MAX_TEXT_FIELD_LENGTH}
        maxLength={MAX_TEXT_FIELD_LENGTH}
        name="parent"
        label="ФИО родителя"
        value={form.values.parent}
        error={form.errors.parent}
        onChange={handleChange}
        onBlur={handleBlur("parent")}
        placeholder="Иванов Иван Иванович"
        className="home-page__form-input"
        disabled={isLoading}
      />

      <TextInput
        required
        max={MAX_TEXT_FIELD_LENGTH}
        maxLength={MAX_TEXT_FIELD_LENGTH}
        name="child"
        label="ФИО ребенка"
        value={form.values.child}
        error={form.errors.child}
        onChange={handleChange}
        onBlur={handleBlur("child")}
        placeholder="Иванов Иван Иванович"
        className="home-page__form-input"
        disabled={isLoading}
      />

      <PhoneInput
        required
        name="phone"
        label="Телефон"
        value={form.values.phone}
        error={form.errors.phone}
        onChange={handleChange}
        placeholder="+375 (29) 123-45-67"
        className="home-page__form-input"
        disabled={isLoading}
      />

      <DateInput
        name="date"
        label="Дата рождения ребёнка"
        value={form.values.date}
        error={form.errors.date}
        onChange={handleChange}
        className="home-page__form-input"
        disabled={isLoading}
      />

      <Button
        type="submit"
        variant="main-green-dark"
        withArrow
        className="home-page__form-button"
        disabled={isLoading}
      >
        Оставить заявку
      </Button>

      {form.errors.agreedment && (
        <span className="home-page__form-error">{form.errors.agreedment}</span>
      )}

      <div className="home-page__form-checkbox-container">
        <Checkbox
          id="agreedment"
          name="agreedment"
          checked={form.values.agreedment}
          error={form.errors.agreedment}
          onChange={(checked) => form.setFieldValue("agreedment", checked)}
          className="home-page__form-checkbox"
          disabled={isLoading}
        />

        <span className="home-page__form-checkbox--text">
          Я соглашаюсь с
          <Link
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="home-page__form-checkbox--link"
          >
            политикой обработки конфиденциальных данных
          </Link>
        </span>
      </div>
    </form>
  );
};

function getCurrentBranch(): string {
  const branch = window.location.host.split(".")[0];

  switch (branch) {
    case "minsk":
      return "1";
    case "baranovichi":
      return "2";
    case "borisov":
      return "3";
    case "novopolotsk":
      return "4";
  }

  return "1";
}

export default HomePageForm;
