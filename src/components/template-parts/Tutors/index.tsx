"use client";

import classNames from "classnames";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";

import TutorsDetail from "./TutorsDetail";
import TutorsSlider, { type TutorsSliderTransition } from "./TutorsSlider";
import TutorsSwiper from "./TutorsSwiper";
import { hasTutorImage } from "./tutorImages";
import type { TutorsSliderSlide } from "./tutorSlideMetrics";
import {
  getMaxTutorsTailInView,
  getTutorMetricsPreset,
  TUTOR_COMPACT_BREAKPOINT,
  TUTOR_DESKTOP_BREAKPOINT,
} from "./tutorSlideMetrics";

import type { TutorItem } from "./types";

import "swiper/css";

type PropTypes = {
  tag?: string;
  title?: string;
  text?: string;
  items?: TutorItem[];
};

const MAX_TUTORS_TAIL_IN_VIEW = 3;

/** Чтобы активный всегда у левого края был один узкий превью-слайд. */
function orderedTutorIndices(
  activeIndex: number,
  n: number,
  maxTailInView = MAX_TUTORS_TAIL_IN_VIEW
): number[] {
  if (n <= 1) return [activeIndex];
  const prevIdx = (activeIndex - 1 + n) % n;
  const tailCount = Math.min(n - 2, maxTailInView);
  const tail: number[] = [];
  for (let step = 0; step < tailCount; step += 1) {
    tail.push((activeIndex + 1 + step) % n);
  }
  return [prevIdx, activeIndex, ...tail];
}

const AUTOPLAY_DELAY_MS = 4_000;
const IDLE_RESUME_MS = 10_000;
const DESKTOP_ACTIVE_SLOT = 1;

const Tutors: FC<PropTypes> = ({ tag, title, text, items = [] }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const tutorCountRef = useRef(0);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const inViewportRef = useRef(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const activeIndexRef = useRef(0);
  const slidesWithImagesRef = useRef<TutorItem[]>([]);
  const desktopTransitionIdRef = useRef(0);
  const slideTransitionRef = useRef<{
    direction: TutorsSliderTransition;
    slides: TutorsSliderSlide[];
    id: number;
    withEnterSlide: boolean;
  } | null>(null);
  const maxTutorsTailInViewRef = useRef(MAX_TUTORS_TAIL_IN_VIEW);
  const tutorsPaginationElRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideTransition, setSlideTransition] = useState<{
    direction: TutorsSliderTransition;
    slides: TutorsSliderSlide[];
    id: number;
    withEnterSlide: boolean;
  } | null>(null);
  const [isTabletLandscapeTutors, setIsTabletLandscapeTutors] = useState(false);
  const [isTutorsPagination, setIsTutorsPagination] = useState(false);
  const [maxTutorsTailInView, setMaxTutorsTailInView] = useState(MAX_TUTORS_TAIL_IN_VIEW);

  const slidesWithImages = useMemo(() => items.filter((item) => hasTutorImage(item)), [items]);
  const tutorCount = useMemo(() => slidesWithImages.length, [slidesWithImages]);

  const orderedIndices = useMemo(
    () => orderedTutorIndices(activeIndex, tutorCount, maxTutorsTailInView),
    [activeIndex, maxTutorsTailInView, tutorCount]
  );

  const orderedSlides = useMemo(
    () =>
      orderedIndices.map((tutorIdx, slot) => ({
        item: slidesWithImages[tutorIdx],
        key: `tutor-${slidesWithImages[tutorIdx]?.id ?? slot}`,
        tutorIdx,
      })),
    [orderedIndices, slidesWithImages]
  );

  const desktopSlides = useMemo(
    () => orderedSlides.map(({ item, key }) => ({ item, key })),
    [orderedSlides]
  );

  const buildDesktopSlideSnapshot = useCallback(
    (fromIndex: number, direction: TutorsSliderTransition) => {
      const n = tutorCountRef.current;
      const items = slidesWithImagesRef.current;
      const base = orderedTutorIndices(fromIndex, n, maxTutorsTailInViewRef.current).map(
        (tutorIdx, slot) => ({
          item: items[tutorIdx],
          key: `tutor-${items[tutorIdx]?.id ?? slot}`,
        })
      );

      if (direction !== "prev" || n < 3) {
        return { slides: base, withEnterSlide: false };
      }

      const baseIndices = orderedTutorIndices(fromIndex, n, maxTutorsTailInViewRef.current);
      const newActive = (fromIndex - 1 + n) % n;
      const enterIdx = (newActive - 1 + n) % n;

      if (!baseIndices.includes(enterIdx)) {
        return {
          slides: [
            {
              item: items[enterIdx],
              key: `tutor-${items[enterIdx]?.id ?? enterIdx}`,
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
    (direction: TutorsSliderTransition) => {
      if (slideTransitionRef.current) return false;

      const n = tutorCountRef.current;
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

  const slidesForSwiper = useMemo(
    () =>
      slidesWithImages.map((item, tutorIdx) => ({
        item,
        key: `compact-${item.id}-${tutorIdx}`,
        tutorIdx,
      })),
    [slidesWithImages]
  );

  const activeItem = useMemo(
    () => slidesWithImages[activeIndex] ?? slidesWithImages[0],
    [activeIndex, slidesWithImages]
  );

  const resolveTutorIndexFromSlot = useCallback((slot: number, fromIndex: number) => {
    const ring = orderedTutorIndices(
      fromIndex,
      tutorCountRef.current,
      maxTutorsTailInViewRef.current
    );
    const next = ring[slot];
    return next !== undefined ? next : fromIndex;
  }, []);

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

    const tick = () => {
      return '';
      autoplayTimerRef.current = null;
      if (pausedRef.current) return;
      if (!inViewportRef.current) return;

      const n = tutorCountRef.current;
      if (n < 1) return;

      if (slideTransitionRef.current) {
        autoplayTimerRef.current = setTimeout(tick, 400);
        return;
      }

      if (!isTabletLandscapeTutors && startDesktopTransition("next")) {
        autoplayTimerRef.current = setTimeout(tick, AUTOPLAY_DELAY_MS);
        return;
      }

      setActiveIndex((prev) => (prev + 1) % n);
      autoplayTimerRef.current = setTimeout(tick, AUTOPLAY_DELAY_MS);
    };

    autoplayTimerRef.current = setTimeout(tick, AUTOPLAY_DELAY_MS);
  }, [clearAutoplayTimer, isTabletLandscapeTutors, startDesktopTransition]);

  const onUserInteraction = useCallback(() => {
    pausedRef.current = true;

    clearAutoplayTimer();
    clearResumeTimer();

    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      pausedRef.current = false;
      scheduleAutoplayStep();
    }, IDLE_RESUME_MS);
  }, [clearAutoplayTimer, clearResumeTimer, scheduleAutoplayStep]);

  const goPrev = useCallback(() => {
    onUserInteraction();
    const n = tutorCount;
    if (n < 1) return;

    if (!isTabletLandscapeTutors && startDesktopTransition("prev")) {
      return;
    }

    setActiveIndex((i) => (i - 1 + n) % n);
  }, [isTabletLandscapeTutors, onUserInteraction, startDesktopTransition, tutorCount]);

  const goNext = useCallback(() => {
    onUserInteraction();
    const n = tutorCount;
    if (n < 1) return;

    if (!isTabletLandscapeTutors && startDesktopTransition("next")) {
      return;
    }

    setActiveIndex((i) => (i + 1) % n);
  }, [isTabletLandscapeTutors, onUserInteraction, startDesktopTransition, tutorCount]);

  const onDesktopSlideClick = useCallback(
    (slot: number) => {
      if (slideTransitionRef.current) return;

      if (slot === DESKTOP_ACTIVE_SLOT) {
        onUserInteraction();
        return;
      }

      onUserInteraction();

      if (slot === 0) {
        if (!startDesktopTransition("prev")) {
          setActiveIndex((prev) => resolveTutorIndexFromSlot(slot, prev));
        }
        return;
      }

      if (slot === 2) {
        if (!startDesktopTransition("next")) {
          setActiveIndex((prev) => resolveTutorIndexFromSlot(slot, prev));
        }
        return;
      }

      setActiveIndex((prev) => resolveTutorIndexFromSlot(slot, prev));
    },
    [onUserInteraction, resolveTutorIndexFromSlot, startDesktopTransition]
  );

  const onSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      if (inViewportRef.current && !pausedRef.current) {
        scheduleAutoplayStep();
      }
    },
    [scheduleAutoplayStep]
  );

  const onSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);

    requestAnimationFrame(() => {
      if (swiper.destroyed) return;
      swiper.updateSlides();
      swiper.updateSlidesClasses();
    });
  }, []);

  const onSwiperClick = useCallback(
    (swiper: SwiperType) => {
      const slide = swiper.clickedSlide;
      if (!slide) return;

      const slot = swiper.slides.indexOf(slide);
      if (slot < 0) return;

      if (slot === swiper.activeIndex) {
        onUserInteraction();
        return;
      }

      onUserInteraction();
      setActiveIndex(slot);
    },
    [onUserInteraction]
  );

  const onSwiperSliderFirstMove = useCallback(() => {
    onUserInteraction();
  }, [onUserInteraction]);

  useEffect(() => {
    tutorCountRef.current = tutorCount;
  }, [tutorCount]);

  useEffect(() => {
    slidesWithImagesRef.current = slidesWithImages;
  }, [slidesWithImages]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const mq1440 = window.matchMedia(`(max-width: ${TUTOR_DESKTOP_BREAKPOINT}px)`);
    const mq1280 = window.matchMedia(`(max-width: ${TUTOR_COMPACT_BREAKPOINT}px)`);

    const syncTailCount = () => {
      const preset = getTutorMetricsPreset(mq1280.matches, mq1440.matches);
      const nextTail = getMaxTutorsTailInView(preset);
      maxTutorsTailInViewRef.current = nextTail;
      setMaxTutorsTailInView(nextTail);
    };

    syncTailCount();

    mq1440.addEventListener("change", syncTailCount);
    mq1280.addEventListener("change", syncTailCount);

    return () => {
      mq1440.removeEventListener("change", syncTailCount);
      mq1280.removeEventListener("change", syncTailCount);
    };
  }, []);

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const landscapeMaxPx = Number.parseFloat(
      rootStyle.getPropertyValue("--layout-landscape-tablet-max").trim()
    );
    const tabletMaxPx = Number.parseFloat(rootStyle.getPropertyValue("--layout-tablet-max").trim());
    if (!Number.isFinite(landscapeMaxPx) || !Number.isFinite(tabletMaxPx)) return;

    const mqLandscape = window.matchMedia(`(max-width: ${landscapeMaxPx}px)`);
    const mqTablet = window.matchMedia(`(max-width: ${tabletMaxPx}px)`);

    const syncLandscape = () => setIsTabletLandscapeTutors(mqLandscape.matches);
    const syncPagination = () => setIsTutorsPagination(mqTablet.matches);

    syncLandscape();
    syncPagination();

    mqLandscape.addEventListener("change", syncLandscape);
    mqTablet.addEventListener("change", syncPagination);

    return () => {
      mqLandscape.removeEventListener("change", syncLandscape);
      mqTablet.removeEventListener("change", syncPagination);
    };
  }, []);

  const tutorsPaginationEnabled = isTabletLandscapeTutors && isTutorsPagination;

  useEffect(() => {
    if (!isTabletLandscapeTutors) return;
    const sw = swiperRef.current;
    if (!sw || sw.destroyed || sw.realIndex === activeIndex) return;
    sw.slideTo(activeIndex, 0, false);
  }, [activeIndex, isTabletLandscapeTutors]);

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
  }, [clearAutoplayTimer, scheduleAutoplayStep, tutorCount]);

  if (!tutorCount) {
    return null;
  }

  return (
    <section ref={sectionRef} id="tutors">
      <div className={classNames("home-page__block", "home-page__tutors")}>
        <div className="home-page__container">
          {tag && <div className="home-page__tag">{tag}</div>}

          <div className={classNames("home-page__formats-top", "home-page__tutors-top")}>
            {title && (
              <h2 className={classNames("home-page__h2", "home-page__tutors-title")}>{title}</h2>
            )}
            {text && (
              <div className={classNames("home-page__text", "home-page__tutors-text")}>{text}</div>
            )}
          </div>

          <div className="home-page__tutors-body">
            <div className="home-page__tutors-carousel">
              {isTabletLandscapeTutors ? (
                <div ref={tutorsPaginationElRef} className="home-page__tutors-pagination-root" />
              ) : null}
              <div className="home-page__tutors-slider-viewport">
                {activeItem && <TutorsDetail item={activeItem} onPrev={goPrev} onNext={goNext} />}

                {isTabletLandscapeTutors ? (
                  <TutorsSwiper
                    slidesForSwiper={slidesForSwiper}
                    activeIndex={activeIndex}
                    tutorCount={tutorCount}
                    tutorsPaginationEnabled={tutorsPaginationEnabled}
                    swipeEnabled={isTutorsPagination}
                    paginationElRef={tutorsPaginationElRef}
                    onSwiper={onSwiper}
                    onSwiperClick={onSwiperClick}
                    onSlideChange={onSlideChange}
                    onSwiperSliderFirstMove={onSwiperSliderFirstMove}
                  />
                ) : (
                  <TutorsSlider
                    slides={slideTransition?.slides ?? desktopSlides}
                    transition={slideTransition?.direction ?? null}
                    transitionId={slideTransition?.id ?? 0}
                    withEnterSlide={slideTransition?.withEnterSlide ?? false}
                    onSlideClick={onDesktopSlideClick}
                    onSwipeNext={goNext}
                    onSwipePrev={goPrev}
                    onTransitionEnd={onDesktopTransitionEnd}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tutors;
