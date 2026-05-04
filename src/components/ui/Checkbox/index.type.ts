import { InputHTMLAttributes } from "react";

export type CheckboxPropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  onChange?: (checked: boolean) => void;
  error?: string;
};
