"use client";

import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import WhyWeAreSVG from "@/src/assets/images/templates/homepage/whyWeAre/why_we_are.svg";

import Icon from "@/src/components/ui/Icon/Icon";

import { PAGE_ANCHORS } from "@/src/utils/constant";
import "swiper/css";

type PropTypes = {
  tag: string;
  title: string;
  text: string;
  items: {
    id: string;
    title: string;
    text: string;
    star: number;
    fullName: string;
    position: string;
    createdAt: string;
  }[];
  info: {
    rating: string;
    blocks: string;
    recommended: string;
    format: string;
  };
};

const AUTOPLAY_DELAY_MS = 4_000;
const IDLE_RESUME_MS = 10_000;

const WhyWeAre: FC<PropTypes> = ({ tag, title, text, items, info }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const inViewportRef = useRef(false);
  const slideCountRef = useRef(0);

  const swiperSlides = useMemo(() => items.map((item) => ({ item, key: item.id })), [items]);

  const infoData = [
    {
      title: info.rating,
      subtitle: "Рейтинг на Яндекс",
    },
    {
      title: info.blocks,
      subtitle: "обучающих блока",
    },
    {
      title: info.recommended,
      subtitle: "Рекомендуют нас",
    },
    {
      title: info.format,
      subtitle: "удобный формат обучения",
    },
  ];

  const clearAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const scheduleAutoplayStep = useCallback(() => {
    clearAutoplayTimer();

    if (!inViewportRef.current || pausedRef.current) return;
    if (slideCountRef.current <= 1) return;

    const sw = swiperRef.current;
    if (sw && !sw.destroyed && sw.isEnd) return;

    const tick = () => {
      autoplayTimerRef.current = null;
      if (pausedRef.current) return;
      if (!inViewportRef.current) return;
      if (slideCountRef.current <= 1) return;

      const sw = swiperRef.current;
      if (!sw || sw.destroyed || sw.isEnd) return;

      sw.slideNext();
      autoplayTimerRef.current = setTimeout(tick, AUTOPLAY_DELAY_MS);
    };

    autoplayTimerRef.current = setTimeout(tick, AUTOPLAY_DELAY_MS);
  }, [clearAutoplayTimer]);

  const onUserInteraction = useCallback(() => {
    if (slideCountRef.current <= 1) return;

    pausedRef.current = true;

    clearAutoplayTimer();
    clearResumeTimer();

    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      pausedRef.current = false;
      scheduleAutoplayStep();
    }, IDLE_RESUME_MS);
  }, [clearAutoplayTimer, clearResumeTimer, scheduleAutoplayStep]);

  const onSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      if (inViewportRef.current && !pausedRef.current && slideCountRef.current > 1) {
        scheduleAutoplayStep();
      }
    },
    [scheduleAutoplayStep]
  );

  const onSwiperClick = useCallback(
    (swiper: SwiperType) => {
      const slide = swiper.clickedSlide;
      if (!slide) return;

      const slot = swiper.slides.indexOf(slide);
      if (slot < 0) return;

      onUserInteraction();

      if (slot !== swiper.activeIndex) {
        swiper.slideTo(slot);
      }
    },
    [onUserInteraction]
  );

  useEffect(() => {
    slideCountRef.current = items.length;
  }, [items.length]);

  useEffect(
    () => () => {
      clearAutoplayTimer();
      clearResumeTimer();
    },
    [clearAutoplayTimer, clearResumeTimer]
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const syncAutoplayVisibility = (visible: boolean) => {
      inViewportRef.current = visible;
      if (visible) {
        if (!pausedRef.current) scheduleAutoplayStep();
      } else {
        clearAutoplayTimer();
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

    return () => observer.disconnect();
  }, [clearAutoplayTimer, items.length, scheduleAutoplayStep]);

  if (!items.length || !swiperSlides.length) {
    return null;
  }

  return (
    <section ref={sectionRef} id={PAGE_ANCHORS.REVIEWS}>
      <div className="home-page__block home-page__why-we-are">
        <div className="home-page__container">
          {tag && <div className="home-page__tag">{tag}</div>}

          <div className="home-page__formats-top home-page__why-we-are-top">
            {title && (
              <h2 className="home-page__h2 home-page__formats-title home-page__why-we-are-title">
                {title}
              </h2>
            )}

            {text && (
              <div className="home-page__formats-text home-page__why-we-are-text">
                {text}
                <span className="home-page__why-we-are-top-icon">
                  <WhyWeAreSVG />
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className="home-page__why-we-are-body"
          onPointerDownCapture={items.length > 1 ? onUserInteraction : undefined}
        >
          <Swiper
            modules={[Pagination]}
            grabCursor
            centeredSlides
            initialSlide={1}
            slidesPerView="auto"
            watchOverflow={false}
            watchSlidesProgress
            observer
            observeSlideChildren
            resizeObserver
            onSwiper={onSwiper}
            onClick={onSwiperClick}
            onSliderFirstMove={onUserInteraction}
            className="home-page__why-we-are-swiper"
            spaceBetween={10}
            pagination={{
              enabled: true,
              clickable: true,
              hideOnClick: false,
              bulletClass: "home-page__why-we-are-pagination-bullet",
              bulletActiveClass: "home-page__why-we-are-pagination-bullet--active",
            }}
            breakpoints={{
              801: {
                pagination: { enabled: false },
                spaceBetween: 0,
              },
              1024: {
                spaceBetween: 10,
              },
              1440: {
                spaceBetween: 20,
              },
              1920: {
                spaceBetween: 40,
              },
            }}
          >
            {swiperSlides.map(({ item, key }) => (
              <SwiperSlide key={key}>
                <div className="home-page__why-we-are-item">
                  <div className="home-page__why-we-are-item__headline">
                    <div className="home-page__why-we-are-item--avatar">
                      {item.fullName
                        .split(" ")
                        .map((item) => item.slice(0, 1))
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
                        <Icon name="star" key={`${key}-h-${index}`} />
                      ))}
                    </div>
                  </div>

                  <div className="home-page__why-we-are-item--text">{item.text}</div>

                  <div className="home-page__why-we-are-item--meta">
                    <div className="home-page__why-we-are-item--created-at">{item.createdAt}</div>

                    <div className="home-page__why-we-are-item--star home-page__why-we-are-item--star-meta">
                      {Array.from({ length: item.star }).map((_, index) => (
                        <Icon name="star" key={`${key}-m-${index}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="home-page__container">
          <div className="home-page__why-we-are-info">
            {infoData.map((item) => (
              <div className="home-page__why-we-are-info-item" key={item.title}>
                <p className="home-page__why-we-are-info-item-title">{item.title}</p>

                <span className="home-page__why-we-are-info-item-subtitle">{item.subtitle}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeAre;
