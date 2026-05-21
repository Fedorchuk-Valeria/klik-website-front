"use client";

import classNames from "classnames";
import { Fragment, useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import imgGreen from "@/src/assets/images/templates/homepage/formats/green.jpg";
import imgOrange from "@/src/assets/images/templates/homepage/formats/orange.jpg";
import imgPink from "@/src/assets/images/templates/homepage/formats/pink.jpg";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { stripHtml } from "@/src/helper/stripHtml";

import Link from "next/link";
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
  url?: string;
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

const FORMATS_AUTOPLAY_DELAY_MS = 5_000;
const FORMATS_IDLE_RESUME_MS = 10_000;

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
  const [layoutInstant, setLayoutInstant] = useState(false);

  const formatsAccordionRef = useRef<HTMLDivElement>(null);
  const formatsSliderViewportRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const inViewportRef = useRef(false);
  const slideCountRef = useRef(0);

  const hasActiveAccordion = activeIndex !== null && !useSliderLayout;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const collapseFormatsInstantly = useCallback((holdUntilScrollEnd = false) => {
    if (activeIndexRef.current === null && !holdUntilScrollEnd) return;

    setLayoutInstant(true);
    setActiveIndex(null);

    let finished = false;
    const finishInstant = () => {
      if (finished) return;
      finished = true;
      setLayoutInstant(false);
    };

    if (holdUntilScrollEnd) {
      window.addEventListener("scrollend", finishInstant, { once: true });
      window.setTimeout(finishInstant, 1200);
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(finishInstant);
    });
  }, []);

  const handleDetailClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      event.stopPropagation();
      collapseFormatsInstantly(true);
    },
    [collapseFormatsInstantly]
  );

  const clearFormatsAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const clearFormatsResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const scheduleFormatsAutoplayStep = useCallback(() => {
    clearFormatsAutoplayTimer();

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
      autoplayTimerRef.current = setTimeout(tick, FORMATS_AUTOPLAY_DELAY_MS);
    };

    autoplayTimerRef.current = setTimeout(tick, FORMATS_AUTOPLAY_DELAY_MS);
  }, [clearFormatsAutoplayTimer]);

  const onFormatsSliderUserInteraction = useCallback(() => {
    if (slideCountRef.current <= 1) return;

    pausedRef.current = true;

    clearFormatsAutoplayTimer();
    clearFormatsResumeTimer();

    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      pausedRef.current = false;
      scheduleFormatsAutoplayStep();
    }, FORMATS_IDLE_RESUME_MS);
  }, [clearFormatsAutoplayTimer, clearFormatsResumeTimer, scheduleFormatsAutoplayStep]);

  const syncSlideFromSwiper = useCallback((swiper: SwiperType) => {
    setMobileSlideIndex(swiper.realIndex);
  }, []);

  const onFormatsSwiperMount = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      setMobileSlideIndex(swiper.realIndex);
      if (
        useSliderLayout &&
        inViewportRef.current &&
        !pausedRef.current &&
        slideCountRef.current > 1
      ) {
        scheduleFormatsAutoplayStep();
      }
    },
    [scheduleFormatsAutoplayStep, useSliderLayout]
  );

  useEffect(() => {
    slideCountRef.current = items.length;
  }, [items.length]);

  useEffect(
    () => () => {
      clearFormatsAutoplayTimer();
      clearFormatsResumeTimer();
    },
    [clearFormatsAutoplayTimer, clearFormatsResumeTimer]
  );

  useEffect(() => {
    if (!useSliderLayout || items.length <= 1) {
      clearFormatsAutoplayTimer();
      clearFormatsResumeTimer();
      swiperRef.current = null;
    }
  }, [useSliderLayout, items.length, clearFormatsAutoplayTimer, clearFormatsResumeTimer]);

  useEffect(() => {
    if (useSliderLayout) return;

    const el = formatsAccordionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          collapseFormatsInstantly();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [useSliderLayout, collapseFormatsInstantly]);

  useEffect(() => {
    if (!useSliderLayout || items.length <= 1) {
      inViewportRef.current = false;
      clearFormatsAutoplayTimer();
      return;
    }

    const el = formatsSliderViewportRef.current;
    if (!el) {
      inViewportRef.current = false;
      clearFormatsAutoplayTimer();
      return;
    }

    const syncAutoplayVisibility = (visible: boolean) => {
      inViewportRef.current = visible;

      if (visible) {
        if (!pausedRef.current) scheduleFormatsAutoplayStep();
      } else {
        clearFormatsAutoplayTimer();
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
      clearFormatsAutoplayTimer();
    };
  }, [useSliderLayout, items.length, clearFormatsAutoplayTimer, scheduleFormatsAutoplayStep]);

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

            {!!item.url && (
              <Link href={item.url} onClick={handleDetailClick}>
                <Button
                  className="formats__content-button"
                  variant="main-light"
                  withArrow={true}
                  onClick={handleDetailClick}
                >
                  Подробнее
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (useSliderLayout) {
    return (
      <div
        ref={formatsSliderViewportRef}
        className="formats__slider-viewport"
        onPointerDownCapture={items.length > 1 ? onFormatsSliderUserInteraction : undefined}
      >
        <Swiper
          modules={[Pagination]}
          className={classNames("formats", "formats--slider")}
          rewind
          slidesPerView={1}
          watchOverflow
          spaceBetween={16}
          onSlideChange={syncSlideFromSwiper}
          onSwiper={onFormatsSwiperMount}
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
      </div>
    );
  }

  return (
    <div
      ref={formatsAccordionRef}
      className={classNames("formats", { "formats--instant": layoutInstant })}
    >
      {items.map((item, index) => (
        <Fragment key={`${item.class}-${index}`}>
          {renderItem(item, index, { type: "accordion" })}
        </Fragment>
      ))}
    </div>
  );
};

export default FormatsList;
