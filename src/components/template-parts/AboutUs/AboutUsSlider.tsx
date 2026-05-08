"use client";

import classNames from "classnames";
import Image, { type StaticImageData } from "next/image";
import { FC } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import image1 from "@/src/assets/images/templates/homepage/aboutUs/1.png";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { AboutUsSlideContentItem } from "@/src/lib/content/types";

import "swiper/css";

const ABOUT_US_SLIDE_IMAGES: Record<number, StaticImageData> = {
  1: image1,
};

type PropTypes = {
  slides: AboutUsSlideContentItem[];
};

const AboutUsSlider: FC<PropTypes> = ({ slides }) => {
  return (
    <Swiper
      modules={[Pagination]}
      grabCursor
      slidesPerView={1}
      spaceBetween={0}
      watchOverflow={false}
      className="home-page__about-us--slider home-page__about-us--slider-swiper"
      pagination={{
        enabled: true,
        clickable: true,
        hideOnClick: false,
        bulletClass: "home-page__about-us-pagination-bullet",
        bulletActiveClass: "home-page__about-us-pagination-bullet--active",
      }}
      breakpoints={{
        501: {
          slidesPerView: slides.length,
          spaceBetween: 19,
          pagination: { enabled: false },
        },
      }}
    >
      {slides.map((slide) => {
        const slideImage = slide.image != null ? ABOUT_US_SLIDE_IMAGES[slide.image] : undefined;

        return (
          <SwiperSlide key={slide.id}>
            <div
              className={classNames(
                "home-page__about-us--slider-item",
                `home-page__about-us--slider-item__${slide.type}`
              )}
            >
              {slide.type === "info-success" && (
                <div className="home-page__about-us--slider-item-success">
                  <Icon name="success" />
                </div>
              )}

              {slideImage && (
                <div className="home-page__about-us--slider-item-image">
                  <Image fill src={slideImage} alt={slide.title} className="slide-image" />
                </div>
              )}

              <span className="home-page__about-us--slider-item-title">{slide.title}</span>

              {(slide.tag || slide.link) && (
                <div className="home-page__about-us--slider-item-footer">
                  {slide.tag && (
                    <span className="home-page__tag home-page__about-us--slider-item-tag">
                      {slide.tag}
                    </span>
                  )}

                  {slide.link && (
                    <Button
                      variant="main-green-dark"
                      className="home-page__about-us--slider-item-button"
                    >
                      <Icon name="arrow-long" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default AboutUsSlider;
