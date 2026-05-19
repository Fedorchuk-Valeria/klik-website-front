import { PASSWORD_REGEX } from "@/src/utils/constant";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  phone: Yup.string().required("Пожалуйста, заполните поле"),
  password: Yup.string().required("Пожалуйста, заполните поле"),
});

export const registerValidationSchema = Yup.object().shape({
  phone: Yup.string().required("Пожалуйста, заполните поле"),
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
