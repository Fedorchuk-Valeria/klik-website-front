import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  phone: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});
