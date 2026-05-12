"use client";

import classNames from "classnames";
import { FC, memo, useEffect, useRef, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import useClickOutside from "@/src/hooks/useClickOutside";

type HowSignUpDropdownItemProps = {
  title: string;
  text: string;
  defaultOpen?: boolean;
};

const HowSignUpDropdownItem: FC<HowSignUpDropdownItemProps> = ({
  title,
  text,
  defaultOpen = false,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState("0px");

  const paragraphs = text
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    if (isOpen) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen, text]);

  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div
      ref={ref}
      className={classNames("how-sign-up__dropdown-item", {
        "is-open": isOpen,
      })}
    >
      <button
        type="button"
        className={classNames("how-sign-up__dropdown-trigger", {
          "is-open": isOpen,
        })}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="how-sign-up__dropdown-trigger-title">{title}</span>

        <span className="how-sign-up__dropdown-trigger-icon">
          <Icon name="arrow" />
        </span>
      </button>

      <div
        className={classNames("how-sign-up__dropdown-panel", {
          "is-open": isOpen,
        })}
        style={{ height }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className="how-sign-up__dropdown-panel-inner">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="how-sign-up__dropdown-panel-text">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(HowSignUpDropdownItem);
