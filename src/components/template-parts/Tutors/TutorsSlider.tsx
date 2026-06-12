"use client";

import classNames from "classnames";
import Image from "next/image";
import {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { TUTOR_IMAGES } from "./tutorImages";
import type { TutorsSliderSlide } from "./tutorSlideMetrics";
import {
  DESKTOP_ACTIVE_SLOT,
  getNextTransitionLayouts,
  getPrevTransitionLayouts,
  getSlotLayout,
  TUTOR_SLIDE_METRICS_1440,
  TUTOR_SLIDE_METRICS_1920,
  TUTORS_SLIDE_TRANSITION_MS,
  type TutorSlideMetrics,
} from "./tutorSlideMetrics";

export type { TutorsSliderSlide };

export type TutorsSliderTransition = "next" | "prev";

export type TutorsSliderProps = {
  slides: TutorsSliderSlide[];
  transition: TutorsSliderTransition | null;
  transitionId: number;
  withEnterSlide?: boolean;
  onSlideClick: (slot: number) => void;
  onSwipeNext: () => void;
  onSwipePrev: () => void;
  onTransitionEnd: () => void;
};

const SWIPE_THRESHOLD_PX = 48;
const SWIPE_ACTIVATION_PX = 8;

const TutorsSlider: FC<TutorsSliderProps> = ({
  slides,
  transition,
  transitionId,
  withEnterSlide = false,
  onSlideClick,
  onSwipeNext,
  onSwipePrev,
  onTransitionEnd,
}) => {
  const [metrics, setMetrics] = useState<TutorSlideMetrics>(TUTOR_SLIDE_METRICS_1920);
  const [runTransitionId, setRunTransitionId] = useState(0);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const pointerCapturedRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1440px)");
    const sync = () => setMetrics(mq.matches ? TUTOR_SLIDE_METRICS_1440 : TUTOR_SLIDE_METRICS_1920);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (!transition || transitionId === 0) {
      return;
    }

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      if (trackRef.current) {
        void trackRef.current.getBoundingClientRect();
      }

      raf2 = requestAnimationFrame(() => {
        setRunTransitionId(transitionId);
      });
    });

    const timerId = window.setTimeout(() => {
      requestAnimationFrame(() => {
        onTransitionEnd();
      });
    }, TUTORS_SLIDE_TRANSITION_MS);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(timerId);
    };
  }, [transition, transitionId, onTransitionEnd]);

  const animPhase: "idle" | "start" | "run" =
    !transition || transitionId === 0
      ? "idle"
      : runTransitionId === transitionId
        ? "run"
        : "start";

  const incomingActiveSlot = useMemo(() => {
    if (slides.length === 2) return 0;
    if (transition === "next") return 2;
    if (transition === "prev" && withEnterSlide) return 1;
    return 0;
  }, [slides.length, transition, withEnterSlide]);

  const getSlideStyle = useCallback(
    (slot: number): CSSProperties => {
      if (transition) {
        const layouts =
          transition === "next"
            ? getNextTransitionLayouts(slot, slides.length, metrics)
            : getPrevTransitionLayouts(slot, slides.length, metrics, withEnterSlide);

        const layout = animPhase === "run" ? layouts.to : layouts.from;
        const isRunning = animPhase === "run";

        return {
          position: "absolute",
          left: layout.left,
          width: layout.width,
          height: layout.height,
          opacity: layout.opacity,
          bottom: 0,
          zIndex: slot === incomingActiveSlot ? 2 : 1,
          transition: isRunning
            ? `left ${TUTORS_SLIDE_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), width ${TUTORS_SLIDE_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), height ${TUTORS_SLIDE_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${TUTORS_SLIDE_TRANSITION_MS}ms ease-in-out`
            : "none",
        };
      }

      const layout = getSlotLayout(slot, metrics);

      return {
        position: "absolute",
        left: layout.left,
        width: layout.width,
        height: layout.height,
        opacity: layout.opacity,
        bottom: 0,
      };
    },
    [animPhase, incomingActiveSlot, metrics, slides.length, transition, withEnterSlide]
  );

  const isOutgoingActive = useCallback(
    (slot: number) => {
      if (!transition) {
        return slot === DESKTOP_ACTIVE_SLOT;
      }

      if (transition === "prev" && withEnterSlide) {
        return slot === 2;
      }

      return slot === DESKTOP_ACTIVE_SLOT;
    },
    [transition, withEnterSlide]
  );

  const isIncomingActive = useCallback(
    (slot: number) => {
      if (!transition) {
        return slot === DESKTOP_ACTIVE_SLOT;
      }

      return slot === incomingActiveSlot;
    },
    [incomingActiveSlot, transition]
  );

  const showTags = useCallback(
    (slot: number) => {
      if (!isIncomingActive(slot)) return false;
      if (transition) return animPhase === "run";
      return true;
    },
    [animPhase, isIncomingActive, transition]
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (transition) return;
      if (event.button !== 0) return;

      pointerStartXRef.current = event.clientX;
      pointerIdRef.current = event.pointerId;
      pointerCapturedRef.current = false;
    },
    [transition]
  );

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartXRef.current == null || pointerIdRef.current !== event.pointerId) return;

    const deltaX = event.clientX - pointerStartXRef.current;
    if (!pointerCapturedRef.current && Math.abs(deltaX) >= SWIPE_ACTIVATION_PX) {
      pointerCapturedRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }, []);

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerStartXRef.current == null || pointerIdRef.current !== event.pointerId) return;

      const deltaX = event.clientX - pointerStartXRef.current;
      pointerStartXRef.current = null;
      pointerIdRef.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      pointerCapturedRef.current = false;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

      if (deltaX < 0) {
        onSwipeNext();
      } else {
        onSwipePrev();
      }
    },
    [onSwipeNext, onSwipePrev]
  );

  const onPointerCancel = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current === event.pointerId) {
      pointerStartXRef.current = null;
      pointerIdRef.current = null;
      pointerCapturedRef.current = false;
    }
  }, []);

  const isAnimating = transition != null;

  const trackMinHeight = useMemo(() => {
    let maxH = metrics.activeH;

    if (transition) {
      for (let slot = 0; slot < slides.length; slot += 1) {
        const layouts =
          transition === "next"
            ? getNextTransitionLayouts(slot, slides.length, metrics)
            : getPrevTransitionLayouts(slot, slides.length, metrics, withEnterSlide);

        maxH = Math.max(maxH, layouts.from.height, layouts.to.height);
      }
    }

    return maxH;
  }, [metrics, slides.length, transition, withEnterSlide]);

  const stableSlotCount = useMemo(() => {
    if (transition === "prev" && withEnterSlide && slides.length > 2) {
      return slides.length - 1;
    }

    return slides.length;
  }, [slides.length, transition, withEnterSlide]);

  const trackWidth = useMemo(() => {
    if (stableSlotCount <= 0) return 0;

    const lastLayout = getSlotLayout(stableSlotCount - 1, metrics);
    return lastLayout.left + lastLayout.width;
  }, [metrics, stableSlotCount]);

  return (
    <div
      className={classNames("home-page__tutors-slider", {
        "home-page__tutors-slider--animating": isAnimating,
      })}
      style={{ minHeight: trackMinHeight }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div
        ref={trackRef}
        className="home-page__tutors-slider__track"
        style={{
          position: "relative",
          minHeight: trackMinHeight,
          width: trackWidth,
        }}
      >
        {slides.map(({ item, key }, slot) => {
          const img = item ? TUTOR_IMAGES[item.id] : undefined;
          if (!item || !img) return null;

          const isOutgoing = isOutgoingActive(slot);
          const isIncoming = isIncomingActive(slot);
          const slideStyle = getSlideStyle(slot);

          return (
            <div
              key={key}
              className={classNames("home-page__tutors-slide", {
                "home-page__tutors-slide--active": isOutgoing,
                "home-page__tutors-slide--incoming-active":
                  isIncoming && isAnimating && animPhase === "run",
                "home-page__tutors-slide--animating": isAnimating,
              })}
              style={slideStyle}
              onClick={() => onSlideClick(slot)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSlideClick(slot);
                }
              }}
              role="button"
              tabIndex={isAnimating ? -1 : 0}
              aria-current={isIncoming ? "true" : undefined}
            >
              <div className="home-page__tutors-thumb">
                {showTags(slot) ? (
                  <div className="home-page__tutors-thumb__tags" aria-hidden>
                    {item.tags.map((tutorTag) => (
                      <span className="home-page__tutors-tag" key={`${key}-${tutorTag}`}>
                        {tutorTag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="home-page__tutors-thumb__img-wrap">
                  <Image
                    className="home-page__tutors-thumb__img"
                    src={img}
                    alt=""
                    width={560}
                    height={700}
                    sizes="(max-width: 1440px) 414px, 560px"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TutorsSlider;
