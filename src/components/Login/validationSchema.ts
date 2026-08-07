import { PASSWORD_REGEX } from "@/src/utils/constant";
import { phoneFieldSchema } from "@/src/utils/validation/phoneSchema";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  phone: phoneFieldSchema,
  password: Yup.string().required("Пожалуйста, заполните поле"),
});

export const registerValidationSchema = Yup.object().shape({
  phone: phoneFieldSchema,
  email: Yup.string().email("Введите корректный email").required("Пожалуйста, заполните поле"),
  password: Yup.string()
    .min(8, "Пожалуйста, введите корректный пароль")
    .max(64, "Пожалуйста, введите корректный пароль")
    .matches(
      PASSWORD_REGEX,
      "Пароль должен содержать заглавную и строчную буквы, цифру и специальный символ"
    )
    .required("Пожалуйста, заполните поле"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Пароли не совпадают")
    .required("Пожалуйста, заполните поле"),
  name: Yup.string().required("Пожалуйста, заполните поле"),
});

export const setNewPasswordValidationSchema = Yup.object().shape({
  password: Yup.string().required("Пожалуйста, заполните поле"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Пароли не совпадают")
    .required("Пожалуйста, заполните поле"),
});

export const resetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string().email("Введите корректный email").required("Пожалуйста, заполните поле"),
});

export const confirmCodeValidationSchema = Yup.object().shape({
  code: Yup.string()
    .required("Пожалуйста, заполните поле")
    .matches(/^\d{4}$/, "Пожалуйста, заполните поле"),
});

export const createChildValidationSchema = Yup.object().shape({
  name: Yup.string().required("Пожалуйста, заполните поле"),
  phone: phoneFieldSchema,
  email: Yup.string().email("Введите корректный email").required("Пожалуйста, заполните поле"),
  password: Yup.string()
    .min(8, "Пожалуйста, введите корректный пароль")
    .max(64, "Пожалуйста, введите корректный пароль")
    .matches(
      PASSWORD_REGEX,
      "Пароль должен содержать заглавную и строчную буквы, цифру и специальный символ"
    )
    .required("Пожалуйста, заполните поле"),
  date: Yup.string().required("Пожалуйста, заполните поле"),
});
