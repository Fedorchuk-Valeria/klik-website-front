import { MenuItem } from "@/src/lib/content/types";

export type FooterInfo =
  | {
      title: string;
      icon: string;
      text: string;
      type: "text";
    }
  | {
      title: string;
      icon: string;
      type: "phone" | "email";
      value: string;
    };

export type FooterWidget = {
  title: string;
  links?: MenuItem[];
};
