import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  parent: Yup.string().required("Пожалуйста, заполните поле"),
  child: Yup.string().required("Пожалуйста, заполните поле"),
  phone: Yup.string().required("Пожалуйста, заполните поле").min(19, "Пожалуйста, заполните поле"),
  date: Yup.string().required("Пожалуйста, заполните поле").min(9, "Пожалуйста, заполните поле"),
  agreedment: Yup.boolean().required("Пожалуйста, заполните поле"),
});
