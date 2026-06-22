"use client";

import { FC, useLayoutEffect, useRef } from "react";

import WhyWeAreReviewCard from "./WhyWeAreReviewCard";
import type { ReviewItem } from "./whyWeAreSlideMetrics";

type PropTypes = {
  items: ReviewItem[];
  activeWidth: number;
  onMaxHeightChange: (height: number) => void;
};

const WhyWeAreReviewHeightProbe: FC<PropTypes> = ({ items, activeWidth, onMaxHeightChange }) => {
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useLayoutEffect(() => {
    if (!items.length || activeWidth <= 0) return;

    let rafId = 0;

    const reportMaxHeight = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        let maxHeight = 0;

        itemRefs.current.forEach((el) => {
          maxHeight = Math.max(maxHeight, Math.round(el.getBoundingClientRect().height));
        });

        if (maxHeight > 0) {
          onMaxHeightChange(maxHeight);
        }
      });
    };

    const observers: ResizeObserver[] = [];

    itemRefs.current.forEach((el) => {
      const observer = new ResizeObserver(reportMaxHeight);
      observer.observe(el);
      observers.push(observer);
    });

    reportMaxHeight();

    return () => {
      cancelAnimationFrame(rafId);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [activeWidth, items, onMaxHeightChange]);

  if (!items.length) {
    return null;
  }

  return (
    <div className="home-page__why-we-are-height-probe" aria-hidden="true">
      {items.map((item) => (
        <div
          key={item.id}
          ref={(node) => {
            if (node) {
              itemRefs.current.set(item.id, node);
            } else {
              itemRefs.current.delete(item.id);
            }
          }}
          className="home-page__why-we-are-height-probe__slide home-page__why-we-are-slide home-page__why-we-are-slide--active"
          style={{ width: activeWidth }}
        >
          <WhyWeAreReviewCard item={item} cardKey={`probe-${item.id}`} />
        </div>
      ))}
    </div>
  );
};

export default WhyWeAreReviewHeightProbe;
