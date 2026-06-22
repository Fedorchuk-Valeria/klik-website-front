"use client";

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import imgBlue from "@/src/assets/images/templates/homepage/programs/blue.jpg";
import imgGreen from "@/src/assets/images/templates/homepage/programs/green.jpg";
import imgPink from "@/src/assets/images/templates/homepage/programs/pink.jpg";

import Icon from "@/src/components/ui/Icon/Icon";

import { ProgramContentItem } from "@/src/lib/content/types";
import { PAGE_ANCHORS } from "@/src/utils/constant";

import "swiper/css";

const programImages: Record<string, string> = {
  blue: imgBlue.src,
  pink: imgPink.src,
  green: imgGreen.src,
};

const PROGRAMS_SLIDER_MAX_CSS_VAR = "--layout-small-landscape-tablet-max";

const PROGRAMS_IDLE_RESUME_MS = 10_000;
const PROGRAMS_AUTOPLAY_DELAY_MS = 5_000;
const PROGRAMS_SWIPE_THRESHOLD_PX = 5;

type PropTypes = {
  tag?: string;
  title?: string;
  text?: string;
  items: ProgramContentItem[];
};

const Programs: FC<PropTypes> = ({ tag, title, text, items }) => {
  const useSliderLayout = useProgramsSliderMatch();
  const programsSliderViewportRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const inViewportRef = useRef(false);
  const slideCountRef = useRef(0);

  const clearProgramsAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const clearProgramsResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const scheduleProgramsAutoplayStep = useCallback(() => {
    clearProgramsAutoplayTimer();

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
      autoplayTimerRef.current = setTimeout(tick, PROGRAMS_AUTOPLAY_DELAY_MS);
    };

    autoplayTimerRef.current = setTimeout(tick, PROGRAMS_AUTOPLAY_DELAY_MS);
  }, [clearProgramsAutoplayTimer]);

  const onProgramsSliderUserInteraction = useCallback(() => {
    if (slideCountRef.current <= 1) return;

    pausedRef.current = true;

    clearProgramsAutoplayTimer();
    clearProgramsResumeTimer();

    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      pausedRef.current = false;
      scheduleProgramsAutoplayStep();
    }, PROGRAMS_IDLE_RESUME_MS);
  }, [clearProgramsAutoplayTimer, clearProgramsResumeTimer, scheduleProgramsAutoplayStep]);

  const onProgramsSwiperMount = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      if (
        useSliderLayout &&
        inViewportRef.current &&
        !pausedRef.current &&
        slideCountRef.current > 1
      ) {
        scheduleProgramsAutoplayStep();
      }
    },
    [scheduleProgramsAutoplayStep, useSliderLayout]
  );

  useEffect(() => {
    slideCountRef.current = items.length;
  }, [items.length]);

  useEffect(
    () => () => {
      clearProgramsAutoplayTimer();
      clearProgramsResumeTimer();
    },
    [clearProgramsAutoplayTimer, clearProgramsResumeTimer]
  );

  useEffect(() => {
    if (!useSliderLayout || items.length <= 1) {
      clearProgramsAutoplayTimer();
      clearProgramsResumeTimer();
      swiperRef.current = null;
    }
  }, [useSliderLayout, items.length, clearProgramsAutoplayTimer, clearProgramsResumeTimer]);

  useEffect(() => {
    if (!useSliderLayout || items.length <= 1) {
      inViewportRef.current = false;
      clearProgramsAutoplayTimer();
      return;
    }

    const el = programsSliderViewportRef.current;
    if (!el) {
      inViewportRef.current = false;
      clearProgramsAutoplayTimer();
      return;
    }

    const syncAutoplayVisibility = (visible: boolean) => {
      inViewportRef.current = visible;

      if (visible) {
        if (!pausedRef.current) scheduleProgramsAutoplayStep();
      } else {
        clearProgramsAutoplayTimer();
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
      clearProgramsAutoplayTimer();
    };
  }, [useSliderLayout, items.length, clearProgramsAutoplayTimer, scheduleProgramsAutoplayStep]);

  const renderProgramCard = (item: ProgramContentItem) => (
    <Link
      className={classNames("home-page__programs-item", item.class)}
      href={`/program/${item.id}`}
    >
      <div className="home-page__programs-item_media">
        {item.tag && <div className="home-page__programs-item_tag">{item.tag}</div>}

        {item.class && programImages[item.class] && (
          <div className="home-page__programs-item_image_wrapper">
            <Image
              className="home-page__programs-item_image"
              src={programImages[item.class]}
              alt={item.title}
              fill
            />
          </div>
        )}
      </div>

      {item.quote && <div className="home-page__programs-item_quote">{item.quote}</div>}

      <div className="home-page__programs-item_body">
        {item.title && <div className="home-page__programs-item_title">{item.title}</div>}

        {item.text && <div className="home-page__programs-item_text">{item.text}</div>}
      </div>

      <div className="home-page__programs-item_more">
        <Icon className="home-page__programs-item_icon" name="arrow-long" />
      </div>
    </Link>
  );

  if (!items.length) {
    return null;
  }

  return (
    <section
      className={classNames("home-page__block home-page__programs", {
        "home-page__programs--slider": useSliderLayout,
      })}
      id={PAGE_ANCHORS.PROGRAMS}
    >
      <div className="home-page__container">
        <div className="home-page__programs-wrapper">
          {tag && <div className="home-page__tag">{tag}</div>}

          <div className="home-page__programs-top">
            {title && <h2 className="home-page__h2 home-page__programs-title">{title}</h2>}

            {text && <div className="home-page__programs-text">{text}</div>}
          </div>

          {useSliderLayout ? (
            <div
              ref={programsSliderViewportRef}
              className="home-page__programs-slider-viewport"
              onPointerDownCapture={items.length > 1 ? onProgramsSliderUserInteraction : undefined}
            >
              <Swiper
                modules={[Pagination]}
                className="home-page__programs-swiper"
                rewind
                slidesPerView={1}
                watchOverflow
                spaceBetween={16}
                threshold={PROGRAMS_SWIPE_THRESHOLD_PX}
                onSwiper={onProgramsSwiperMount}
                pagination={{
                  clickable: true,
                  hideOnClick: false,
                  bulletClass: "home-page__programs-pagination-bullet",
                  bulletActiveClass: "home-page__programs-pagination-bullet--active",
                }}
              >
                {items.map((item, index) => (
                  <SwiperSlide key={`${item.class}-${index}`}>
                    {renderProgramCard(item)}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="home-page__programs-body">
              {items.map((item, index) => (
                <Fragment key={`${item.class}-${index}`}>{renderProgramCard(item)}</Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

function useProgramsSliderMatch() {
  const [useSliderLayout, setUseSliderLayout] = useState(false);

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const sliderMaxPx = Number.parseFloat(
      rootStyle.getPropertyValue(PROGRAMS_SLIDER_MAX_CSS_VAR).trim()
    );
    if (!Number.isFinite(sliderMaxPx)) return;

    const mq = window.matchMedia(`(max-width: ${sliderMaxPx}px)`);
    const sync = () => setUseSliderLayout(mq.matches);

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return useSliderLayout;
}

export default Programs;
