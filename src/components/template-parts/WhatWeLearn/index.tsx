"use client";

import classNames from "classnames";
import Image, { type StaticImageData } from "next/image";
import { FC, useCallback, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import img3d from "@/src/assets/images/templates/homepage/whatWeLearn/3d.png";
import imgBusinessThinking from "@/src/assets/images/templates/homepage/whatWeLearn/business-thinking.png";
import imgCybersecurity from "@/src/assets/images/templates/homepage/whatWeLearn/cybersecurity.png";
import imgDesign from "@/src/assets/images/templates/homepage/whatWeLearn/design.png";
import imgDevelopment from "@/src/assets/images/templates/homepage/whatWeLearn/development.png";
import imgNeuro from "@/src/assets/images/templates/homepage/whatWeLearn/neuro.png";
import imgProgramming from "@/src/assets/images/templates/homepage/whatWeLearn/programming.png";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const SLIDE_IMAGES: Record<string, StaticImageData> = {
  programming: imgProgramming,
  "3d": img3d,
  development: imgDevelopment,
  design: imgDesign,
  neuro: imgNeuro,
  cybersecurity: imgCybersecurity,
  "business-thinking": imgBusinessThinking,
};

type PropTypes = {
  tag?: string;
  title?: string;
  text?: string;
  items?: {
    title: string;
    text: string;
    key: string;
    items: string[];
  }[];
};

const WhatWeLearn: FC<PropTypes> = ({
  tag,
  title,
  text,
  items = [],
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    swiperRef.current?.slideToLoop(index, 400);
  }, []);

  const onSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
  }, []);

  const onRealIndexChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  if (!items.length) {
    return null;
  }

  return (
    <section>
      <div className="home-page__block home-page__what-we-learn">
        <div className="home-page__container">
          {tag && <div className="home-page__tag">{tag}</div>}

          <div className="home-page__formats-top">
            {title && (
              <h2 className="home-page__h2 home-page__formats-title">{title}</h2>
            )}

            {text && <div className="home-page__formats-text">{text}</div>}
          </div>

          <div className="home-page__what-we-learn-body">
            <div className="home-page__what-we-learn-accordion">
              <ul className="home-page__what-we-learn-list">
                {(items || [])?.map((item, index) => {
                  const isOpen = index === activeIndex;

                  return (
                    <li key={item.key || index} className="home-page__what-we-learn-item">
                      <Button
                        type="button"
                        className={classNames("home-page__what-we-learn-trigger", { "is-open": isOpen })}
                        aria-expanded={isOpen}
                        onClick={() => goToSlide(index)}
                      >
                        <span className="home-page__what-we-learn-trigger-title">
                          {item.title}
                        </span>

                        <span className="home-page__what-we-learn-trigger-icon">
                          <Icon name="arrow" />
                        </span>
                      </Button>

                      <div
                        className={classNames("home-page__what-we-learn-panel", { "is-open": isOpen })}
                        hidden={!isOpen}
                      >
                        {item?.text && (
                          <p className="home-page__what-we-learn-panel-text">
                            {item.text}
                          </p>
                        )}

                        {!!item?.items?.length && (
                          <ul className="home-page__what-we-learn-tags">
                            {(item?.items || [])?.map((tag, tagIndex) => (
                              <li key={tagIndex}>{tag}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="home-page__what-we-learn-gallery">
              <Swiper
                className="home-page__what-we-learn-swiper"
                effect="coverflow"
                allowTouchMove={false}
                simulateTouch={false}
                centeredSlides
                slidesPerView="auto"
                initialSlide={0}
                loop={true}
                onSwiper={onSwiper}
                onRealIndexChange={onRealIndexChange}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                modules={[EffectCoverflow]}
              >
                {items.map((item, index) => {
                  const src = SLIDE_IMAGES[item.key];

                  return (
                    <SwiperSlide
                      key={item.key || index}
                      className="home-page__what-we-learn-slide"
                    >
                      <div className="home-page__what-we-learn-slide-frame">
                        {src ? (
                          <>
                            <span className="home-page__what-we-learn-slide-tag">
                              {item.title.toLowerCase()}
                            </span>

                            <Image
                              className="home-page__what-we-learn-slide-img"
                              src={src}
                              alt={item.title}
                              sizes="(max-width: 1200px) 90vw, 560px"
                              priority={index === 0}
                            />
                          </>
                        ) : null}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeLearn;
