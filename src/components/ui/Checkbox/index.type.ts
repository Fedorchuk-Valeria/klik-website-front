import { InputHTMLAttributes } from "react";

export type CheckboxPropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  variant?: "landing" | "test";
  color?: "default" | "red" | "green";
  onChange?: (checked: boolean) => void;
  error?: string;
};
