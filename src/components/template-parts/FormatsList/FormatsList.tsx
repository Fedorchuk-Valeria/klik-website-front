"use client";

import classNames from "classnames";
import { Fragment, useCallback, useEffect, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import imgGreen from "@/src/assets/images/templates/homepage/formats/green.jpg";
import imgOrange from "@/src/assets/images/templates/homepage/formats/orange.jpg";
import imgPink from "@/src/assets/images/templates/homepage/formats/pink.jpg";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { stripHtml } from "@/src/helper/stripHtml";

import "swiper/css";

type ListItem = {
  icon: string;
  title: string;
};

type FormatItem = {
  title: string;
  text: string;
  image?: string;
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

const TABLET_MAX_CSS_VAR = "--layout-tablet-max";

function useFormatsSliderMatch() {
  const [useSliderLayout, setUseSliderLayout] = useState(false);

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const tabletMaxPx = Number.parseFloat(rootStyle.getPropertyValue(TABLET_MAX_CSS_VAR).trim());
    if (!Number.isFinite(tabletMaxPx)) return;

    const mq = window.matchMedia(`(max-width: ${tabletMaxPx}px)`);
    const sync = () => setUseSliderLayout(mq.matches);

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return useSliderLayout;
}

const FormatsList = ({ items }: FormatsListProps) => {
  const useSliderLayout = useFormatsSliderMatch();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);

  const hasActiveAccordion = activeIndex !== null && !useSliderLayout;

  const syncSlideFromSwiper = useCallback((swiper: SwiperType) => {
    setMobileSlideIndex(swiper.realIndex);
  }, []);

  if (!items.length) {
    return null;
  }

  const renderItem = (
    item: FormatItem,
    index: number,
    mode: { type: "accordion" } | { type: "slider" }
  ) => {
    const isActive = mode.type === "slider" ? mobileSlideIndex === index : activeIndex === index;
    const isInactive = mode.type === "accordion" && hasActiveAccordion && !isActive;

    return (
      <div
        className={classNames("formats__item", item.class, {
          "formats__item--active": isActive,
          "formats__item--inactive": isInactive,
        })}
        onClick={
          mode.type === "accordion" ? () => setActiveIndex(isActive ? null : index) : undefined
        }
      >
        {item?.tag && <div className="formats__item-tag">{item.tag}</div>}

        <div className="formats__item-more">
          <Icon className="formats__item-icon" name="plus" />
        </div>

        <div className="formats__item-footer" dangerouslySetInnerHTML={{ __html: item.title }} />

        <div className="formats__inner">
          <div
            className="formats__image"
            style={{ backgroundImage: `url(${formatImages[item.class]})` }}
          />

          <div className="formats__content">
            <div className="formats__content-list">
              {item?.list?.map((listItem, listIndex) => (
                <div className="formats__content-item" key={listIndex}>
                  <div
                    className="formats__content-item_icon"
                    dangerouslySetInnerHTML={{ __html: listItem.icon }}
                  />

                  <div className="formats__content-item_title">{listItem.title}</div>
                </div>
              ))}
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
  };

  if (useSliderLayout) {
    return (
      <Swiper
        modules={[Pagination]}
        className={classNames("formats", "formats--slider")}
        slidesPerView={1}
        watchOverflow
        spaceBetween={16}
        onSlideChange={syncSlideFromSwiper}
        onSwiper={syncSlideFromSwiper}
        pagination={{
          clickable: true,
          hideOnClick: false,
          bulletClass: "formats__pagination-bullet",
          bulletActiveClass: "formats__pagination-bullet--active",
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={`${item.class}-${index}`}>
            {renderItem(item, index, { type: "slider" })}
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <div className="formats">
      {items.map((item, index) => (
        <Fragment key={`${item.class}-${index}`}>
          {renderItem(item, index, { type: "accordion" })}
        </Fragment>
      ))}
    </div>
  );
};

export default FormatsList;
