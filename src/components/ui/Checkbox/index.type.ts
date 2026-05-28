import { InputHTMLAttributes } from "react";

export type CheckboxPropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  variant?: "landing" | "test";
  onChange?: (checked: boolean) => void;
  error?: string;
};
