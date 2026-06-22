"use client";

import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { WhatWeLearnProps } from "../index";

type AccordionItemRow = NonNullable<WhatWeLearnProps["items"]>[number];

type WhatWeLearnAccordionItemProps = {
  item: AccordionItemRow;
  index: number;
  isOpen: boolean;
  onSelect: (index: number) => void;
};

const WhatWeLearnAccordionItem: FC<WhatWeLearnAccordionItemProps> = ({
  item,
  index,
  isOpen,
  onSelect,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    if (!isOpen) {
      queueMicrotask(() => setHeight("0px"));

      return;
    }

    const el = contentRef.current;
    const updateHeight = () => setHeight(`${el.scrollHeight}px`);

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(el);

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [isOpen, item.text, item.items]);

  return (
    <li className="home-page__what-we-learn-item">
      <Button
        type="button"
        className={classNames("home-page__what-we-learn-trigger", { "is-open": isOpen })}
        aria-expanded={isOpen}
        onClick={() => onSelect(index)}
      >
        <span className="home-page__what-we-learn-trigger-title">{item.title}</span>

        <span className="home-page__what-we-learn-trigger-icon">
          <Icon name="arrow" />
        </span>
      </Button>

      <div
        className={classNames("home-page__what-we-learn-panel", { "is-open": isOpen })}
        style={{ height }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className="home-page__what-we-learn-panel-inner">
          {item?.text && <p className="home-page__what-we-learn-panel-text">{item.text}</p>}

          {!!item?.items?.length && (
            <ul className="home-page__what-we-learn-tags">
              {(item?.items || [])?.map((tag, tagIndex) => (
                <li key={tagIndex}>{tag}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
};

export default WhatWeLearnAccordionItem;
