import { isValidPhoneNumber } from "libphonenumber-js";
import * as Yup from "yup";

export const PHONE_REQUIRED_MESSAGE = "Пожалуйста, заполните поле";

/** E.164 phone — empty or incomplete → same message. */
export const phoneFieldSchema = Yup.string()
  .required(PHONE_REQUIRED_MESSAGE)
  .test("phone-complete", PHONE_REQUIRED_MESSAGE, (value) => {
    if (!value) return false;
    return isValidPhoneNumber(value);
  });
