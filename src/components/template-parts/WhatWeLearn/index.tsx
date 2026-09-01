"use client";

import classNames from "classnames";
import Image, { type StaticImageData } from "next/image";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import LineSvg from "@/src/assets/images/templates/homepage/whatWeLearn/line.svg";
import MessageSvg from "@/src/assets/images/templates/homepage/whatWeLearn/message.svg";

import WhatWeLearnAccordionItem from "./WhatWeLearnAaccordionItem";

import { PAGE_ANCHORS } from "@/src/utils/constant";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export type WhatWeLearnProps = {
  tag?: string;
  title?: string;
  text?: string;
  items?: {
    title: string;
    text: string;
    key: string;
    image?: string;
    items: {
      text: string;
      icon?: string;
    }[];
  }[];
};

const TABLET_MAX_CSS_VAR = "--layout-tablet-max";

const SLIDE_TRANSITION_MS = 400;

const WhatWeLearn: FC<WhatWeLearnProps> = ({ tag, title, text, items = [] }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const pendingRefreshRef = useRef(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleAccordionSelect = useCallback(
    (index: number) => {
      if (openIndex === index) {
        setOpenIndex(null);
        return;
      }

      setOpenIndex(index);
      swiperRef.current?.slideToLoop(index, SLIDE_TRANSITION_MS);
    },
    [openIndex]
  );

  const onSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
  }, []);

  const refreshSwiper = useCallback(() => {
    requestAnimationFrame(() => {
      const sw = swiperRef.current;
      if (!sw || sw.destroyed) {
        return;
      }

      if (sw.animating) {
        pendingRefreshRef.current = true;
        return;
      }

      sw.update();
    });
  }, []);

  const onSlideChangeTransitionEnd = useCallback((swiper: SwiperType) => {
    if (!pendingRefreshRef.current) {
      return;
    }

    pendingRefreshRef.current = false;
    requestAnimationFrame(() => {
      if (swiper.destroyed || swiper.animating) {
        return;
      }

      swiper.update();
    });
  }, []);

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const tabletMaxPx = Number.parseFloat(rootStyle.getPropertyValue(TABLET_MAX_CSS_VAR).trim());

    let mq: MediaQueryList | undefined;

    const onGalleryVisible = () => {
      refreshSwiper();
      window.setTimeout(refreshSwiper, 100);
    };

    if (Number.isFinite(tabletMaxPx)) {
      mq = window.matchMedia(`(min-width: ${tabletMaxPx + 1}px)`);
      mq.addEventListener("change", onGalleryVisible);
    }

    let galleryResizeRafId = 0;
    let galleryResizeObserver: ResizeObserver | undefined;
    const galleryEl = galleryRef.current;

    if (galleryEl) {
      galleryResizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(galleryResizeRafId);
        galleryResizeRafId = requestAnimationFrame(refreshSwiper);
      });
      galleryResizeObserver.observe(galleryEl);
    }

    window.addEventListener("resize", refreshSwiper);
    window.visualViewport?.addEventListener("resize", refreshSwiper);

    return () => {
      cancelAnimationFrame(galleryResizeRafId);
      mq?.removeEventListener("change", onGalleryVisible);
      galleryResizeObserver?.disconnect();
      window.removeEventListener("resize", refreshSwiper);
      window.visualViewport?.removeEventListener("resize", refreshSwiper);
    };
  }, [refreshSwiper]);

  if (!items.length) {
    return null;
  }

  return (
    <section id={PAGE_ANCHORS.WHAT}>
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
                    key={index}
                    item={item}
                    index={index}
                    isOpen={openIndex === index}
                    onSelect={handleAccordionSelect}
                  />
                ))}
              </ul>
            </div>

            <div ref={galleryRef} className="home-page__what-we-learn-gallery">
              <Swiper
                className="home-page__what-we-learn-swiper"
                effect="coverflow"
                speed={SLIDE_TRANSITION_MS}
                allowTouchMove={false}
                simulateTouch={false}
                centeredSlides
                slidesPerView="auto"
                initialSlide={0}
                loop={true}
                observer
                observeSlideChildren
                resizeObserver
                onSwiper={onSwiper}
                onSlideChangeTransitionEnd={onSlideChangeTransitionEnd}
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
                  1280: {
                    coverflowEffect: {
                      rotate: 15,
                      stretch: 236,
                      depth: 100,
                      scale: 0.95,
                      modifier: 1,
                      slideShadows: false,
                    },
                  },
                }}
              >
                {items.map((item, index) => {
                  const src = item.image;

                  return (
                    <SwiperSlide key={item.key || index} className="home-page__what-we-learn-slide">
                      <div
                        className="home-page__what-we-learn-slide-frame"
                        style={{ height: '450px' }}
                      >
                        {src ? (
                          <>
                            <span className="home-page__what-we-learn-slide-tag">
                              {item.title.toLowerCase()}
                            </span>

                            <Image
                              className="home-page__what-we-learn-slide-img"
                              src={src}
                              alt={item.title}
                              unoptimized
                              fill
                              priority={index === 0}
                              loading={index === 0 ? undefined : "lazy"}
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
