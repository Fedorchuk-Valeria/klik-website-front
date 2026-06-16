"use client";

import classNames from "classnames";
import Image, { type StaticImageData } from "next/image";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import image1 from "@/src/assets/images/templates/homepage/aboutUs/1.png";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { AboutUsSlideContentItem } from "@/src/lib/content/types";
import { HEADER_ANCHOR_OFFSET_PX, PAGE_ANCHORS } from "@/src/utils/constant";

import "swiper/css";

const ABOUT_US_MOBILE_MAX_PX = 500;
const ABOUT_US_AUTOPLAY_DELAY_MS = 5_000;
const ABOUT_US_IDLE_RESUME_MS = 10_000;
const ABOUT_US_SWIPE_THRESHOLD_PX = 5;

const ABOUT_US_SLIDE_IMAGES: Record<number, StaticImageData> = {
  1: image1,
};

type PropTypes = {
  slides: AboutUsSlideContentItem[];
};

const AboutUsSlider: FC<PropTypes> = ({ slides }) => {
  const sliderViewportRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const inViewportRef = useRef(false);
  const slideCountRef = useRef(0);

  const [mobileSliderMode, setMobileSliderMode] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${ABOUT_US_MOBILE_MAX_PX}px)`);
    const sync = () => setMobileSliderMode(mq.matches);

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    slideCountRef.current = slides.length;
  }, [slides.length]);

  const clearAboutUsAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const clearAboutUsResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const scheduleAboutUsAutoplayStep = useCallback(() => {
    clearAboutUsAutoplayTimer();

    if (!inViewportRef.current || pausedRef.current) return;
    if (slideCountRef.current <= 1) return;

    const tick = () => {
      autoplayTimerRef.current = null;
      if (pausedRef.current) return;
      if (!inViewportRef.current) return;
      if (slideCountRef.current <= 1) return;

      const sw = swiperRef.current;
      if (!sw || sw.destroyed) return;

      sw.slideNext();
      autoplayTimerRef.current = setTimeout(tick, ABOUT_US_AUTOPLAY_DELAY_MS);
    };

    autoplayTimerRef.current = setTimeout(tick, ABOUT_US_AUTOPLAY_DELAY_MS);
  }, [clearAboutUsAutoplayTimer]);

  const onAboutUsSliderUserInteraction = useCallback(() => {
    if (slideCountRef.current <= 1) return;

    pausedRef.current = true;

    clearAboutUsAutoplayTimer();
    clearAboutUsResumeTimer();

    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      pausedRef.current = false;
      scheduleAboutUsAutoplayStep();
    }, ABOUT_US_IDLE_RESUME_MS);
  }, [clearAboutUsAutoplayTimer, clearAboutUsResumeTimer, scheduleAboutUsAutoplayStep]);

  const onAboutUsSwiperMount = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      if (
        mobileSliderMode &&
        inViewportRef.current &&
        !pausedRef.current &&
        slideCountRef.current > 1
      ) {
        scheduleAboutUsAutoplayStep();
      }
    },
    [mobileSliderMode, scheduleAboutUsAutoplayStep]
  );

  useEffect(
    () => () => {
      clearAboutUsAutoplayTimer();
      clearAboutUsResumeTimer();
    },
    [clearAboutUsAutoplayTimer, clearAboutUsResumeTimer]
  );

  useEffect(() => {
    if (!mobileSliderMode || slides.length <= 1) {
      pausedRef.current = false;
      clearAboutUsAutoplayTimer();
      clearAboutUsResumeTimer();
    }
  }, [mobileSliderMode, slides.length, clearAboutUsAutoplayTimer, clearAboutUsResumeTimer]);

  useEffect(() => {
    if (!mobileSliderMode || slides.length <= 1) {
      inViewportRef.current = false;
      clearAboutUsAutoplayTimer();
      return;
    }

    const el = sliderViewportRef.current;
    if (!el) {
      inViewportRef.current = false;
      clearAboutUsAutoplayTimer();
      return;
    }

    const syncAutoplayVisibility = (visible: boolean) => {
      inViewportRef.current = visible;

      if (visible) {
        if (!pausedRef.current) scheduleAboutUsAutoplayStep();
      } else {
        clearAboutUsAutoplayTimer();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        syncAutoplayVisibility(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    const queued = observer.takeRecords();
    if (queued.length) {
      syncAutoplayVisibility(queued[queued.length - 1]?.isIntersecting ?? false);
    }

    return () => {
      observer.disconnect();
      inViewportRef.current = false;
      clearAboutUsAutoplayTimer();
    };
  }, [mobileSliderMode, slides.length, clearAboutUsAutoplayTimer, scheduleAboutUsAutoplayStep]);

  const handleSlideLinkClick = useCallback(
    (isLink: boolean) => () => {
      if (!isLink) return;

      const link = PAGE_ANCHORS.SIGN_UP_FREE_LESSON;
      const element = document.getElementById(link);

      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - HEADER_ANCHOR_OFFSET_PX,
          behavior: "smooth",
        });
      }
    },
    []
  );

  return (
    <div
      ref={sliderViewportRef}
      onPointerDownCapture={
        mobileSliderMode && slides.length > 1 ? onAboutUsSliderUserInteraction : undefined
      }
    >
      <Swiper
        modules={[Pagination]}
        rewind
        grabCursor
        slidesPerView={1}
        spaceBetween={0}
        watchOverflow={false}
        threshold={ABOUT_US_SWIPE_THRESHOLD_PX}
        onSwiper={onAboutUsSwiperMount}
        className="home-page__about-us--slider home-page__about-us--slider-swiper"
        pagination={{
          enabled: true,
          clickable: true,
          hideOnClick: false,
          bulletClass: "home-page__about-us-pagination-bullet",
          bulletActiveClass: "home-page__about-us-pagination-bullet--active",
        }}
        breakpoints={{
          1439: {
            slidesPerView: slides.length,
            spaceBetween: 20,
            pagination: { enabled: false },
          },
          799: {
            slidesPerView: slides.length,
            spaceBetween: 10,
            pagination: { enabled: false },
          },
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
                onClick={handleSlideLinkClick(!!slide.link)}
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
    </div>
  );
};

export default AboutUsSlider;
