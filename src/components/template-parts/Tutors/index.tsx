"use client";

import classNames from "classnames";
import Image, { type StaticImageData } from "next/image";
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import tutorImg1 from "@/src/assets/images/templates/homepage/tutors/tutor_1.jpg";
import tutorImg10 from "@/src/assets/images/templates/homepage/tutors/tutor_10.jpg";
import tutorImg11 from "@/src/assets/images/templates/homepage/tutors/tutor_11.jpg";
import tutorImg12 from "@/src/assets/images/templates/homepage/tutors/tutor_12.jpg";
import tutorImg2 from "@/src/assets/images/templates/homepage/tutors/tutor_2.jpg";
import tutorImg3 from "@/src/assets/images/templates/homepage/tutors/tutor_3.jpg";
import tutorImg4 from "@/src/assets/images/templates/homepage/tutors/tutor_4.jpg";
import tutorImg5 from "@/src/assets/images/templates/homepage/tutors/tutor_5.jpg";
import tutorImg6 from "@/src/assets/images/templates/homepage/tutors/tutor_6.jpg";
import tutorImg7 from "@/src/assets/images/templates/homepage/tutors/tutor_7.jpg";
import tutorImg8 from "@/src/assets/images/templates/homepage/tutors/tutor_8.jpg";
import tutorImg9 from "@/src/assets/images/templates/homepage/tutors/tutor_9.jpg";

import Icon from "@/src/components/ui/Icon/Icon";

import "swiper/css";
import Button from "../../ui/Button/Button";

type TutorItem = {
  id: string;
  name: string;
  position: string;
  text: string;
  location: string;
  tags: string[];
};

type PropTypes = {
  tag?: string;
  title?: string;
  text?: string;
  items?: TutorItem[];
};

const TUTOR_IMAGES: Record<string, StaticImageData> = {
  "1": tutorImg1,
  "2": tutorImg2,
  "3": tutorImg3,
  "4": tutorImg4,
  "5": tutorImg5,
  "6": tutorImg6,
  "7": tutorImg7,
  "8": tutorImg8,
  "9": tutorImg9,
  "10": tutorImg10,
  "11": tutorImg11,
  "12": tutorImg12,
};

const SLIDE_INACTIVE_W = 270;
const SLIDE_ACTIVE_W = 560;
const SLIDE_GAP = 20;

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

const SLIDES_OFFSET_BEFORE = SLIDE_INACTIVE_W + SLIDE_GAP;
const SLIDES_OFFSET_AFTER = SLIDE_ACTIVE_W + SLIDE_INACTIVE_W * 2 + SLIDE_GAP * 2;
const VIEWPORT_W = SLIDE_INACTIVE_W * 4 + SLIDE_ACTIVE_W + SLIDE_GAP * 4;
const DETAIL_LEFT_SPACER_W = SLIDE_INACTIVE_W + SLIDE_GAP + SLIDE_ACTIVE_W;

const AUTOPLAY_DELAY_MS = 4_000;
const IDLE_RESUME_MS = 10_000;

// TODO adaptive
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
  const [activeIndex, setActiveIndex] = useState(0);

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
      // Не сбрасывать паузу здесь: при смене activeIndex key пересоздаёт Swiper,
      // иначе onUserInteraction теряется (снова включается автоплей и сбрасывается 10s resume).
      if (initialSlideMid === 1 && swiper.realIndex !== 1) {
        swiper.slideTo(1, 0, false);
      }
      if (inViewportRef.current && !pausedRef.current) {
        scheduleAutoplayStep();
      }
    },
    [initialSlideMid, scheduleAutoplayStep],
  );

  const onSlideChange = useCallback((swiper: SwiperType) => {
    const slot = swiper.realIndex;

    setActiveIndex((prev) => {
      const ring = orderedTutorIndices(prev, tutorCountRef.current);
      const next = ring[slot];
      return next !== undefined ? next : prev;
    });

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
      if (slot < 0 || slot === swiper.activeIndex) return;

      const n = tutorCountRef.current;

      onUserInteraction();
      setActiveIndex((prev) => {
        const ring = orderedTutorIndices(prev, n);
        const tutorIdx = ring[slot];
        return tutorIdx !== undefined ? tutorIdx : prev;
      });
    },
    [onUserInteraction],
  );

  const onSwiperSliderFirstMove = useCallback(() => {
    onUserInteraction();
  }, [onUserInteraction]);

  useEffect(() => {
    tutorCountRef.current = tutorCount;
  }, [tutorCount]);

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
            <div
              className="home-page__tutors-slider-viewport"
              style={{
                "--tutors-viewport-w": `${VIEWPORT_W}px`,
                "--tutors-detail-spacer-w": `${DETAIL_LEFT_SPACER_W}px`,
              } as CSSProperties}
            >
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

              <Swiper
                speed={0}
                grabCursor
                resizeObserver
                watchSlidesProgress
                slidesPerView="auto"
                initialSlide={initialSlideMid}
                key={`tutor-order-${activeIndex}`}
                className="home-page__tutors-swiper"
                spaceBetween={SLIDE_GAP}
                slidesOffsetAfter={SLIDES_OFFSET_AFTER}
                slidesOffsetBefore={SLIDES_OFFSET_BEFORE}
                observer={false}
                watchOverflow={false}
                centeredSlides={false}
                observeSlideChildren={false}
                onSwiper={onSwiper}
                onClick={onSwiperClick}
                onSlideChange={onSlideChange}
                onSliderFirstMove={onSwiperSliderFirstMove}
              >
                {orderedSlides.map(({ item, key }) => {
                  const img = item ? TUTOR_IMAGES[item.id] : undefined;
                  if (!item || !img) return null;

                  return (
                    <SwiperSlide key={key} className="home-page__tutors-slide">
                      <div className="home-page__tutors-thumb">
                        <div className="home-page__tutors-thumb__tags" aria-hidden>
                          {item.tags.map((tutorTag) => (
                            <span className="home-page__tutors-tag" key={`${key}-${tutorTag}`}>
                              {tutorTag}
                            </span>
                          ))}
                        </div>

                        <div className="home-page__tutors-thumb__img-wrap">
                          <Image
                            className="home-page__tutors-thumb__img"
                            src={img}
                            alt=""
                            width={560}
                            height={700}
                            sizes="560px"
                            draggable={false}
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tutors;
