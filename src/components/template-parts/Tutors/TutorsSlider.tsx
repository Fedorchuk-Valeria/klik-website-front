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
import type { TutorsSliderSlide } from "./tutorSlideMetrics";

export type { TutorsSliderSlide };

export type TutorsSliderTransition = "next" | "prev";

export type TutorsSliderProps = {
  slides: TutorsSliderSlide[];
  transition: TutorsSliderTransition | null;
  transitionId: number;
  onSlideClick: (slot: number) => void;
  onSwipeNext: () => void;
  onSwipePrev: () => void;
  onTransitionEnd: () => void;
};

const SWIPE_THRESHOLD_PX = 48;

const TutorsSlider: FC<TutorsSliderProps> = ({
  slides,
  transition,
  transitionId,
  onSlideClick,
  onSwipeNext,
  onSwipePrev,
  onTransitionEnd,
}) => {
  const [metrics, setMetrics] = useState<TutorSlideMetrics>(TUTOR_SLIDE_METRICS_1920);
  const [animPhase, setAnimPhase] = useState<"idle" | "start" | "run">("idle");
  const pointerStartXRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
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
      setAnimPhase("idle");
      return;
    }

    setAnimPhase("start");

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      if (trackRef.current) {
        void trackRef.current.getBoundingClientRect();
      }

      raf2 = requestAnimationFrame(() => {
        setAnimPhase("run");
      });
    });

    const timerId = window.setTimeout(() => {
      onTransitionEnd();
    }, TUTORS_SLIDE_TRANSITION_MS);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(timerId);
    };
  }, [transition, transitionId, onTransitionEnd]);

  const incomingActiveSlot =
    slides.length === 2 ? 0 : transition === "next" ? 2 : 0;

  const getSlideStyle = useCallback(
    (slot: number): CSSProperties | undefined => {
      if (!transition) return undefined;

      const layouts =
        transition === "next"
          ? getNextTransitionLayouts(slot, slides.length, metrics)
          : getPrevTransitionLayouts(slot, slides.length, metrics);

      const layout = animPhase === "run" ? layouts.to : layouts.from;
      const isAnimating = animPhase === "run";

      return {
        position: "absolute",
        left: layout.left,
        width: layout.width,
        height: layout.height,
        opacity: layout.opacity,
        bottom: 0,
        zIndex: slot === incomingActiveSlot ? 2 : 1,
        transition: isAnimating
          ? `left ${TUTORS_SLIDE_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), width ${TUTORS_SLIDE_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), height ${TUTORS_SLIDE_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${TUTORS_SLIDE_TRANSITION_MS}ms ease-in-out`
          : "none",
      };
    },
    [animPhase, incomingActiveSlot, metrics, slides.length, transition]
  );

  const isOutgoingActive = useCallback(
    (slot: number) => {
      if (!transition) {
        return slot === DESKTOP_ACTIVE_SLOT;
      }

      return slot === DESKTOP_ACTIVE_SLOT;
    },
    [transition]
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
    (slot: number) => isIncomingActive(slot),
    [isIncomingActive]
  );

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (transition) return;
    if (event.button !== 0) return;

    pointerStartXRef.current = event.clientX;
    pointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [transition]);

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerStartXRef.current == null || pointerIdRef.current !== event.pointerId) return;

      const deltaX = event.clientX - pointerStartXRef.current;
      pointerStartXRef.current = null;
      pointerIdRef.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

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
    }
  }, []);

  const trackMinHeight = metrics.activeH;
  const isAnimating = transition != null;

  const animatingTrackWidth = useMemo(() => {
    if (!isAnimating || slides.length === 0) return undefined;
    const lastSlot = slides.length - 1;
    const lastLayout = getSlotLayout(lastSlot, metrics);
    return lastLayout.left + lastLayout.width;
  }, [isAnimating, metrics, slides.length]);

  return (
    <div
      className={classNames("home-page__tutors-slider", {
        "home-page__tutors-slider--animating": isAnimating,
      })}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div
        ref={trackRef}
        className="home-page__tutors-slider__track"
        style={
          isAnimating
            ? {
                position: "relative",
                minHeight: trackMinHeight,
                width: animatingTrackWidth,
              }
            : undefined
        }
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
                "home-page__tutors-slide--incoming-active": isIncoming && isAnimating,
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
