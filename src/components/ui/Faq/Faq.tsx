"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/src/components/ui/Icon/Icon";

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
        <div ref={contentRef} className="faq-answer-inner">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ items }: FAQProps) {
  const [openItems, setOpenItems] = useState<boolean[]>(() => items.map((_, i) => i === 0));

  const toggleItem = (index: number) => {
    setOpenItems((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <div className="faq">
      {items.map((item, index) => (
        <Item
          key={index}
          item={item}
          isOpen={openItems[index]}
          onToggle={() => toggleItem(index)}
        />
      ))}
    </div>
  );
}
