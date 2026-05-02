"use client";

import classNames from "classnames";
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Swiper as SwiperType } from "swiper";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import TutorsSwiper from "./TutorsSwiper";
import { TUTOR_IMAGES } from "./tutorImages";

import type { TutorItem } from "./types";

import "swiper/css";

type PropTypes = {
  tag?: string;
  title?: string;
  text?: string;
  items?: TutorItem[];
};

/** Чтобы активный всегда у левого края был один узкий превью-слайд. */
function orderedTutorIndices(activeIndex: number, n: number): number[] {
  if (n <= 1) return [activeIndex];
  const prevIdx = (activeIndex - 1 + n) % n;
  const tail: number[] = [];
  for (let step = 0; step < n - 2; step += 1) {
    tail.push((activeIndex + 1 + step) % n);
  }
  return [prevIdx, activeIndex, ...tail];
}

const AUTOPLAY_DELAY_MS = 4_000;
const IDLE_RESUME_MS = 10_000;

// TODO effects
const Tutors: FC<PropTypes> = ({
  tag,
  title,
  text,
  items = [],
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const tutorCountRef = useRef(0);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const inViewportRef = useRef(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const tutorsPaginationElRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTabletLandscapeTutors, setIsTabletLandscapeTutors] = useState(false);
  const [isTutorsPagination, setIsTutorsPagination] = useState(false);

  const slidesWithImages = useMemo(
    () => items.filter((item) => TUTOR_IMAGES[item.id] != null),
    [items],
  );
  const tutorCount = useMemo(() => slidesWithImages.length, [slidesWithImages]);

  const orderedIndices = useMemo(
    () => orderedTutorIndices(activeIndex, tutorCount),
    [activeIndex, tutorCount],
  );

  const orderedSlides = useMemo(
    () => orderedIndices.map((tutorIdx, slot) => ({
      item: slidesWithImages[tutorIdx],
      key: `${slidesWithImages[tutorIdx]?.id ?? slot}-${slot}`,
      tutorIdx,
    })),
    [orderedIndices, slidesWithImages],
  );

  const slidesForSwiper = useMemo(
    () =>
      isTabletLandscapeTutors
        ? slidesWithImages.map((item, tutorIdx) => ({
          item,
          key: `compact-${item.id}-${tutorIdx}`,
          tutorIdx,
        }))
        : orderedSlides,
    [isTabletLandscapeTutors, orderedSlides, slidesWithImages],
  );

  const activeItem = useMemo(() => slidesWithImages[activeIndex] ?? slidesWithImages[0], [activeIndex, slidesWithImages]);

  const initialSlideMid = useMemo(() => tutorCount >= 2 ? 1 : 0, [tutorCount]);

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
      autoplayTimerRef.current = null;
      if (pausedRef.current) return;
      if (!inViewportRef.current) return;

      const n = tutorCountRef.current;
      if (n < 1) return;

      setActiveIndex((prev) => (prev + 1) % n);
      autoplayTimerRef.current = setTimeout(tick, AUTOPLAY_DELAY_MS);
    };

    autoplayTimerRef.current = setTimeout(tick, AUTOPLAY_DELAY_MS);
  }, [clearAutoplayTimer]);

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
    setActiveIndex((i) => (i - 1 + n) % n);
  }, [onUserInteraction, tutorCount]);

  const goNext = useCallback(() => {
    onUserInteraction();
    const n = tutorCount;
    if (n < 1) return;
    setActiveIndex((i) => (i + 1) % n);
  }, [onUserInteraction, tutorCount]);

  const onSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      // Не сбрасывать паузу здесь: при смене activeIndex key пересоздаёт Swiper,
      // иначе onUserInteraction теряется (снова включается автоплей и сбрасывается 10s resume).
      if (!isTabletLandscapeTutors && initialSlideMid === 1 && swiper.realIndex !== 1) {
        swiper.slideTo(1, 0, false);
      }
      if (inViewportRef.current && !pausedRef.current) {
        scheduleAutoplayStep();
      }
    },
    [initialSlideMid, isTabletLandscapeTutors, scheduleAutoplayStep],
  );

  const onSlideChange = useCallback((swiper: SwiperType) => {
    const slot = swiper.realIndex;

    if (isTabletLandscapeTutors) {
      setActiveIndex(slot);
    } else {
      setActiveIndex((prev) => {
        const ring = orderedTutorIndices(prev, tutorCountRef.current);
        const next = ring[slot];
        return next !== undefined ? next : prev;
      });
    }

    requestAnimationFrame(() => {
      if (swiper.destroyed) return;
      swiper.updateSlides();
      swiper.updateSlidesClasses();
    });
  }, [isTabletLandscapeTutors]);

  const onSwiperClick = useCallback(
    (swiper: SwiperType) => {
      const slide = swiper.clickedSlide;
      if (!slide) return;

      const slot = swiper.slides.indexOf(slide);
      if (slot < 0 || slot === swiper.activeIndex) return;

      const n = tutorCountRef.current;

      onUserInteraction();
      if (isTabletLandscapeTutors) {
        setActiveIndex(slot);
      } else {
        setActiveIndex((prev) => {
          const ring = orderedTutorIndices(prev, n);
          const tutorIdx = ring[slot];
          return tutorIdx !== undefined ? tutorIdx : prev;
        });
      }
    },
    [isTabletLandscapeTutors, onUserInteraction],
  );

  const onSwiperSliderFirstMove = useCallback(() => {
    onUserInteraction();
  }, [onUserInteraction]);

  useEffect(() => {
    tutorCountRef.current = tutorCount;
  }, [tutorCount]);

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const landscapeMaxPx = Number.parseFloat(
      rootStyle.getPropertyValue("--layout-landscape-tablet-max").trim(),
    );
    const tabletMaxPx = Number.parseFloat(
      rootStyle.getPropertyValue("--layout-tablet-max").trim(),
    );
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
    [clearAutoplayTimer, clearResumeTimer],
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
      { threshold: 0.15 },
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
    <section ref={sectionRef}>
      <div className={classNames("home-page__block", "home-page__tutors")}>
        <div className="home-page__container">
          {tag && <div className="home-page__tag">{tag}</div>}

          <div className={classNames("home-page__formats-top", "home-page__tutors-top")}>
            {title && <h2 className={classNames("home-page__h2", "home-page__tutors-title")}>{title}</h2>}
            {text && <div className={classNames("home-page__text", "home-page__tutors-text")}>{text}</div>}
          </div>
        </div>

        <div className="home-page__tutors-body">
          <div className="home-page__tutors-carousel">
            {isTabletLandscapeTutors ? (
              <div
                ref={tutorsPaginationElRef}
                className="home-page__tutors-pagination-root"
              />
            ) : null}
            <div className="home-page__tutors-slider-viewport">
              {activeItem && (
                <aside
                  className="home-page__tutors-detail"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="home-page__tutors-detail__inner">
                    <div className="home-page__tutors-detail__text" key={activeItem.id}>
                      <h3 className="home-page__tutors-detail__name">
                        {activeItem.name}
                      </h3>

                      <p className="home-page__tutors-detail__position">
                        {activeItem.position}
                      </p>
                    </div>

                    <p className="home-page__tutors-detail__description">
                      {activeItem.text}
                    </p>

                    <div className="home-page__tutors-detail__location">
                      <Icon name="pin" />

                      {activeItem.location}
                    </div>

                    <div className="home-page__tutors-detail__nav">
                      <Button
                        variant="orange"
                        type="button"
                        className={classNames("home-page__tutors-nav", "home-page__tutors-nav--prev")}
                        aria-label="Предыдущий наставник"
                        onClick={goPrev}
                      >
                        <Icon className="home-page__tutors-nav-icon" name="arrow" />
                      </Button>

                      <Button
                        variant="orange"
                        type="button"
                        className={classNames("home-page__tutors-nav", "home-page__tutors-nav--next")}
                        aria-label="Следующий наставник"
                        onClick={goNext}
                      >
                        <Icon className="home-page__tutors-nav-icon" name="arrow" />
                      </Button>
                    </div>
                  </div>
                </aside>
              )}

              <TutorsSwiper
                slidesForSwiper={slidesForSwiper}
                isTabletLandscapeTutors={isTabletLandscapeTutors}
                activeIndex={activeIndex}
                initialSlideMid={initialSlideMid}
                tutorCount={tutorCount}
                tutorsPaginationEnabled={tutorsPaginationEnabled}
                paginationElRef={tutorsPaginationElRef}
                onSwiper={onSwiper}
                onSwiperClick={onSwiperClick}
                onSlideChange={onSlideChange}
                onSwiperSliderFirstMove={onSwiperSliderFirstMove}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tutors;
