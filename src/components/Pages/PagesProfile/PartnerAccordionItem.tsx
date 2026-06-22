import classNames from "classnames";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";

type PartnerItem = {
  image: string;
  title: string;
  description: ReactNode;
};

type PartnerAccordionItemProps = {
  item: PartnerItem;
  isOpen: boolean;
  onToggle: () => void;
};

const PartnerAccordionItem = ({ item, isOpen, onToggle }: PartnerAccordionItemProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div
      className={classNames("children-details-page__partners_item", {
        "is-open": isOpen,
      })}
    >
      <button
        type="button"
        className="children-details-page__partners_item-header"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <Image
          src={item.image}
          alt={item.title}
          className="children-details-page__partners_item-image"
        />

        <p className="children-details-page__partners_item-title">{item.title}</p>

        <span className="children-details-page__partners_item-button">
          <Icon name="arrow" />
        </span>
      </button>

      <div className="children-details-page__partners_item-content" style={{ height }}>
        <div ref={contentRef} className="children-details-page__partners_item-content-inner">
          {item.description}
        </div>
      </div>
    </div>
  );
};

export default PartnerAccordionItem;
