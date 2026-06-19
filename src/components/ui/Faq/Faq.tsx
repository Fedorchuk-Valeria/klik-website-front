"use client";

import Icon from "@/src/components/ui/Icon/Icon";
import { useEffect, useRef, useState } from "react";

type FAQItemType = {
  question: string;
  answer: string;
};

type FAQProps = {
  items: FAQItemType[];
};

type ItemProps = {
  item: FAQItemType;
  isOpen: boolean;
  onToggle: () => void;
};

function Item({ item, isOpen, onToggle }: ItemProps) {
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
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={onToggle}>
        <span>{item.question}</span>
        <span className="faq-more">
          <Icon name="arrow" />
        </span>
      </button>

      <div className="faq-answer" style={{ height }}>
        <div ref={contentRef} className="faq-answer-inner" dangerouslySetInnerHTML={{ __html: item.answer }} />
      </div>
    </div>
  );
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(() => (items.length > 0 ? 0 : null));

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="faq">
      {items.map((item, index) => (
        <Item
          key={index}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => toggleItem(index)}
        />
      ))}
    </div>
  );
}
