import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  parent: Yup.string().required("Имя обязательно для заполнения"),
  child: Yup.string().required("Имя обязательно для заполнения"),
  phone: Yup.string().required("Имя обязательно для заполнения"),
  date: Yup.date().required("Имя обязательно для заполнения"),
});
