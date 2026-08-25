"use client";

import React from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import classNames from "classnames";
import Link from "next/link";

export type ButtonVariant =
  | "orange"
  | "main-light"
  | "main-green-dark"
  | "outline-green-dark"
  | "outline-orange"
  | "main-light-outline";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  withArrow?: boolean;
  href?: string;
};

export default function Button({
  variant = "orange",
  withArrow = false,
  className = "",
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = classNames("button", `button--${variant}`, className);
  const content = (
    <>
      <span className="button__text">{children}</span>
      {withArrow && (
        <span className="button__arrow">
          <Icon name="arrow-long" />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
