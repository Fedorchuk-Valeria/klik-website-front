"use client";

import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import WhyWeAreSVG from "@/src/assets/images/templates/homepage/whyWeAre/why_we_are.svg";

import WhyWeAreReviewCard from "./WhyWeAreReviewCard";
import WhyWeAreSlider, { type WhyWeAreSliderTransition } from "./WhyWeAreSlider";
import type { ReviewItem, WhyWeAreSliderSlide } from "./whyWeAreSlideMetrics";
import { REVIEW_ACTIVE_SLOT } from "./whyWeAreSlideMetrics";

import { PAGE_ANCHORS } from "@/src/utils/constant";
import "swiper/css";

type PropTypes = {
  tag: string;
  title: string;
  text: string;
  items: ReviewItem[];
  info: {
    rating: string;
    blocks: string;
    recommended: string;
    format: string;
  };
};

const MAX_REVIEWS_TAIL_IN_VIEW = 3;
const AUTOPLAY_DELAY_MS = 4_000;
const IDLE_RESUME_MS = 10_000;
const DESKTOP_REVIEWS_MIN_PX = 801;

function orderedReviewIndices(activeIndex: number, n: number): number[] {
  if (n <= 1) return [activeIndex];
  const prevIdx = (activeIndex - 1 + n) % n;
  const tailCount = Math.min(n - 2, MAX_REVIEWS_TAIL_IN_VIEW);
  const tail: number[] = [];
  for (let step = 0; step < tailCount; step += 1) {
    tail.push((activeIndex + 1 + step) % n);
  }
  return [prevIdx, activeIndex, ...tail];
}

const WhyWeAre: FC<PropTypes> = ({ tag, title, text, items, info }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const inViewportRef = useRef(false);
  const slideCountRef = useRef(0);
  const activeIndexRef = useRef(0);
  const itemsRef = useRef<ReviewItem[]>([]);
  const activeHeightsRef = useRef<Record<string, number>>({});
  const desktopTransitionIdRef = useRef(0);
  const slideTransitionRef = useRef<{
    direction: WhyWeAreSliderTransition;
    slides: WhyWeAreSliderSlide[];
    id: number;
    withEnterSlide: boolean;
  } | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeHeights, setActiveHeights] = useState<Record<string, number>>({});
  const [isDesktopReviews, setIsDesktopReviews] = useState(false);
  const [slideTransition, setSlideTransition] = useState<{
    direction: WhyWeAreSliderTransition;
    slides: WhyWeAreSliderSlide[];
    id: number;
    withEnterSlide: boolean;
  } | null>(null);

  const swiperSlides = useMemo(() => items.map((item) => ({ item, key: item.id })), [items]);

  const orderedIndices = useMemo(
    () => orderedReviewIndices(activeIndex, items.length),
    [activeIndex, items.length]
  );

  const orderedSlides = useMemo(
    () =>
      orderedIndices.map((reviewIdx, slot) => ({
        item: items[reviewIdx],
        key: `review-${items[reviewIdx]?.id ?? slot}`,
      })),
    [items, orderedIndices]
  );

  const desktopSlides = useMemo(
    () => orderedSlides.map(({ item, key }) => ({ item, key })),
    [orderedSlides]
  );

  const buildDesktopSlideSnapshot = useCallback(
    (fromIndex: number, direction: WhyWeAreSliderTransition) => {
      const n = slideCountRef.current;
      const list = itemsRef.current;
      const base = orderedReviewIndices(fromIndex, n).map((reviewIdx, slot) => ({
        item: list[reviewIdx],
        key: `review-${list[reviewIdx]?.id ?? slot}`,
      }));

      if (direction !== "prev" || n < 3) {
        return { slides: base, withEnterSlide: false };
      }

      const baseIndices = orderedReviewIndices(fromIndex, n);
      const newActive = (fromIndex - 1 + n) % n;
      const enterIdx = (newActive - 1 + n) % n;

      if (!baseIndices.includes(enterIdx)) {
        return {
          slides: [
            {
              item: list[enterIdx],
              key: `review-${list[enterIdx]?.id ?? enterIdx}`,
            },
            ...base,
          ],
          withEnterSlide: true,
        };
      }

      return { slides: base, withEnterSlide: false };
    },
    []
  );

  const startDesktopTransition = useCallback(
    (direction: WhyWeAreSliderTransition) => {
      if (slideTransitionRef.current) return false;

      const n = slideCountRef.current;
      if (n < 2) return false;

      const snapshot = buildDesktopSlideSnapshot(activeIndexRef.current, direction);
      desktopTransitionIdRef.current += 1;
      const nextTransition = {
        direction,
        slides: snapshot.slides,
        withEnterSlide: snapshot.withEnterSlide,
        id: desktopTransitionIdRef.current,
      };

      slideTransitionRef.current = nextTransition;
      setSlideTransition(nextTransition);

      setActiveIndex((i) => (direction === "next" ? (i + 1) % n : (i - 1 + n) % n));

      return true;
    },
    [buildDesktopSlideSnapshot]
  );

  const onDesktopTransitionEnd = useCallback(() => {
    slideTransitionRef.current = null;
    setSlideTransition(null);
  }, []);

  const onMeasureActiveHeight = useCallback((itemId: string, height: number) => {
    if (activeHeightsRef.current[itemId] === height) return;
    activeHeightsRef.current = { ...activeHeightsRef.current, [itemId]: height };
    setActiveHeights(activeHeightsRef.current);
  }, []);

  const resolveReviewIndexFromSlot = useCallback((slot: number, fromIndex: number) => {
    const ring = orderedReviewIndices(fromIndex, slideCountRef.current);
    const next = ring[slot];
    return next !== undefined ? next : fromIndex;
  }, []);

  const infoData = [
    { title: info.rating, subtitle: "Рейтинг на Яндекс" },
    { title: info.blocks, subtitle: "обучающих блока" },
    { title: info.recommended, subtitle: "Рекомендуют нас" },
    { title: info.format, subtitle: "удобный формат обучения" },
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

    const tick = () => {
      autoplayTimerRef.current = null;
      if (pausedRef.current) return;
      if (!inViewportRef.current) return;
      if (slideCountRef.current <= 1) return;

      if (slideTransitionRef.current) {
        autoplayTimerRef.current = setTimeout(tick, 400);
        return;
      }

      if (isDesktopReviews) {
        if (startDesktopTransition("next")) {
          autoplayTimerRef.current = setTimeout(tick, AUTOPLAY_DELAY_MS);
        }
        return;
      }

      const sw = swiperRef.current;
      if (!sw || sw.destroyed || sw.isEnd) return;

      sw.slideNext();
      autoplayTimerRef.current = setTimeout(tick, AUTOPLAY_DELAY_MS);
    };

    autoplayTimerRef.current = setTimeout(tick, AUTOPLAY_DELAY_MS);
  }, [clearAutoplayTimer, isDesktopReviews, startDesktopTransition]);

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

  const goNext = useCallback(() => {
    onUserInteraction();
    const n = items.length;
    if (n < 2) return;

    if (isDesktopReviews && startDesktopTransition("next")) {
      return;
    }

    const sw = swiperRef.current;
    if (sw && !sw.destroyed && !sw.isEnd) {
      sw.slideNext();
    }
  }, [isDesktopReviews, items.length, onUserInteraction, startDesktopTransition]);

  const goPrev = useCallback(() => {
    onUserInteraction();
    const n = items.length;
    if (n < 2) return;

    if (isDesktopReviews && startDesktopTransition("prev")) {
      return;
    }

    const sw = swiperRef.current;
    if (sw && !sw.destroyed && !sw.isBeginning) {
      sw.slidePrev();
    }
  }, [isDesktopReviews, items.length, onUserInteraction, startDesktopTransition]);

  const onDesktopSlideClick = useCallback(
    (slot: number) => {
      if (slideTransitionRef.current) return;

      if (slot === REVIEW_ACTIVE_SLOT) {
        onUserInteraction();
        return;
      }

      onUserInteraction();

      if (slot === 0) {
        if (!startDesktopTransition("prev")) {
          setActiveIndex((prev) => resolveReviewIndexFromSlot(slot, prev));
        }
        return;
      }

      if (slot === 2) {
        if (!startDesktopTransition("next")) {
          setActiveIndex((prev) => resolveReviewIndexFromSlot(slot, prev));
        }
        return;
      }

      setActiveIndex((prev) => resolveReviewIndexFromSlot(slot, prev));
    },
    [onUserInteraction, resolveReviewIndexFromSlot, startDesktopTransition]
  );

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
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_REVIEWS_MIN_PX}px)`);
    const sync = () => setIsDesktopReviews(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
          {isDesktopReviews ? (
            <WhyWeAreSlider
              slides={slideTransition?.slides ?? desktopSlides}
              transition={slideTransition?.direction ?? null}
              transitionId={slideTransition?.id ?? 0}
              withEnterSlide={slideTransition?.withEnterSlide ?? false}
              activeHeights={activeHeights}
              onSlideClick={onDesktopSlideClick}
              onSwipeNext={goNext}
              onSwipePrev={goPrev}
              onTransitionEnd={onDesktopTransitionEnd}
              onMeasureActiveHeight={onMeasureActiveHeight}
            />
          ) : (
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
                  <WhyWeAreReviewCard item={item} cardKey={key} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
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
