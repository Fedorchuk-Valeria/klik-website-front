import type { ChangeEvent, ComponentPropsWithoutRef } from "react";

export type CodeInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "maxLength"
> & {
  value?: string;
  defaultValue?: string;
  error?: string | boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};
