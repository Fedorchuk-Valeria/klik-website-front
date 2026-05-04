"use client";
import imgOrange from "@/src/assets/images/templates/homepage/formats/orange.jpg";
import imgPink from "@/src/assets/images/templates/homepage/formats/pink.jpg";
import imgGreen from "@/src/assets/images/templates/homepage/formats/green.jpg";
import React, { useState } from "react";
import { stripHtml } from "@/src/helper/stripHtml";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

type ListItem = {
  icon: string;
  title: string;
};

type FormatItem = {
  title: string;
  text: string;
  image: string;
  class: string;
  tag?: string;
  list?: ListItem[];
};

type FormatsListProps = {
  items: FormatItem[];
};

export const formatImages: Record<string, string> = {
  orange: imgOrange.src,
  pink: imgPink.src,
  green: imgGreen.src,
};

const FormatsList = ({ items }: FormatsListProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasActive = activeIndex !== null;

  return (
    <div className="formats">
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const isInactive = hasActive && !isActive;

        return (
          <div
            key={index}
            className={`formats__item ${item.class}
                            ${isActive ? "formats__item--active" : ""}
                            ${isInactive ? "formats__item--inactive" : ""}
                        `}
            onClick={() => setActiveIndex(isActive ? null : index)}
          >
            {item?.tag && <div className="formats__item-tag">{item.tag}</div>}
            <div className="formats__item-more">
              <Icon className="formats__item-icon" name="plus" />
            </div>
            <div
              className="formats__item-footer"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />

            <div className="formats__inner">
              <div
                className="formats__image"
                style={{ backgroundImage: `url(${formatImages[item.class]})` }}
              />
              <div className="formats__content">
                <div className="formats__content-list">
                  {item?.list?.map((item, index) => {
                    return (
                      <div className="formats__content-item" key={index}>
                        <div
                          className="formats__content-item_icon"
                          dangerouslySetInnerHTML={{ __html: item.icon }}
                        />
                        <div className="formats__content-item_title">{item.title}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="formats__content-title">{stripHtml(item.title)}</div>
                <div
                  className="formats__content-text"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
                <Button className="formats__content-button" variant="main-light" withArrow={true}>
                  Подробнее
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FormatsList;
