"use client";

import { useRouter } from "next/navigation";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { PAGES } from "@/src/utils/constant";
import classNames from "classnames";

export type ButtonBackProps = {
  label: string;
  className?: string;
  onClick?: () => void;
};

export default function ButtonBack({
  label,
  className,
  onClick
}: ButtonBackProps) {

  return (
    <button className={classNames("button-back", className)} onClick={onClick}>
      <Icon className="button-back__icon" name="arrow" />
      {label}
    </button>
  );
}
