"use client";

import { forwardRef } from "react";

import Icon from "@/src/components/ui/Icon/Icon";

import type { ReviewItem } from "./whyWeAreSlideMetrics";

type PropTypes = {
  item: ReviewItem;
  cardKey: string;
};

const WhyWeAreReviewCard = forwardRef<HTMLDivElement, PropTypes>(({ item, cardKey }, ref) => (
  <div ref={ref} className="home-page__why-we-are-item">
    <div className="home-page__why-we-are-item__headline">
      <div className="home-page__why-we-are-item--avatar">
        {item.fullName
          .split(" ")
          .map((part) => part.slice(0, 1))
          .join("")}
      </div>

      <div className="home-page__why-we-are-item--info">
        <h3 className="home-page__why-we-are-item--info-title">“ {item.title} ”</h3>
        <p className="home-page__why-we-are-item--info-text">
          {item.fullName} | {item.position}
        </p>
      </div>

      <div className="home-page__why-we-are-item--star home-page__why-we-are-item--star-headline">
        {Array.from({ length: item.star }).map((_, index) => (
          <Icon name="star" key={`${cardKey}-h-${index}`} />
        ))}
      </div>
    </div>

    <div className="home-page__why-we-are-item--text">{item.text}</div>

    <div className="home-page__why-we-are-item--meta">
      <div className="home-page__why-we-are-item--created-at">{item.createdAt}</div>

      <div className="home-page__why-we-are-item--star home-page__why-we-are-item--star-meta">
        {Array.from({ length: item.star }).map((_, index) => (
          <Icon name="star" key={`${cardKey}-m-${index}`} />
        ))}
      </div>
    </div>
  </div>
));

WhyWeAreReviewCard.displayName = "WhyWeAreReviewCard";

export default WhyWeAreReviewCard;
