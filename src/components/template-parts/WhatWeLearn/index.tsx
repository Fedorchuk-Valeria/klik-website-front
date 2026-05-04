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
import LineSvg from "@/src/assets/images/templates/homepage/whatWeLearn/line.svg";
import MessageSvg from "@/src/assets/images/templates/homepage/whatWeLearn/message.svg";
import imgNeuro from "@/src/assets/images/templates/homepage/whatWeLearn/neuro.png";
import imgProgramming from "@/src/assets/images/templates/homepage/whatWeLearn/programming.png";

import WhatWeLearnAccordionItem from "./WhatWeLearnAaccordionItem";

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

export type WhatWeLearnProps = {
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

const WhatWeLearn: FC<WhatWeLearnProps> = ({ tag, title, text, items = [] }) => {
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
        <span className="home-page__what-we-learn-line">
          <LineSvg />

          <span className="home-page__what-we-learn-line-message">
            <MessageSvg />
          </span>
        </span>

        <div className="home-page__container">
          {tag && <div className="home-page__tag">{tag}</div>}

          <div className={classNames("home-page__formats-top", "home-page__what-we-learn-top")}>
            {title && (
              <h2
                className={classNames(
                  "home-page__h2",
                  "home-page__formats-title",
                  "home-page__what-we-learn-title"
                )}
              >
                {title}
              </h2>
            )}

            {text && (
              <div
                className={classNames("home-page__formats-text", "home-page__what-we-learn-text")}
              >
                {text}
              </div>
            )}
          </div>

          <div className="home-page__what-we-learn-body">
            <div className="home-page__what-we-learn-accordion">
              <ul className="home-page__what-we-learn-list">
                {(items || [])?.map((item, index) => (
                  <WhatWeLearnAccordionItem
                    key={item.key || index}
                    item={item}
                    index={index}
                    isOpen={index === activeIndex}
                    onSelect={goToSlide}
                  />
                ))}
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
                modules={[EffectCoverflow]}
                breakpoints={{
                  1920: {
                    coverflowEffect: {
                      rotate: 15,
                      stretch: 211,
                      depth: 100,
                      scale: 0.95,
                      modifier: 1,
                      slideShadows: false,
                    },
                  },
                  1440: {
                    coverflowEffect: {
                      rotate: 15,
                      stretch: 278,
                      depth: 100,
                      scale: 0.95,
                      modifier: 1,
                      slideShadows: false,
                    },
                  },
                }}
              >
                {items.map((item, index) => {
                  const src = SLIDE_IMAGES[item.key];

                  return (
                    <SwiperSlide key={item.key || index} className="home-page__what-we-learn-slide">
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
