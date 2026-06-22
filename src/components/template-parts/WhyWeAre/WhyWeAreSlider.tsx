"use client";

import classNames from "classnames";
import { CSSProperties, FC, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import WhyWeAreReviewCard from "./WhyWeAreReviewCard";
import WhyWeAreReviewHeightProbe from "./WhyWeAreReviewHeightProbe";
import {
  buildReviewMetrics,
  getNextReviewTransitionLayouts,
  getPrevReviewTransitionLayouts,
  getReviewSlotLayout,
  pickReviewMetricsBase,
  REVIEW_ACTIVE_SLOT,
  REVIEW_CAROUSEL_HEIGHT,
  REVIEW_SLIDE_METRICS_1920,
  REVIEWS_SLIDE_TRANSITION_MS,
  type ReviewItem,
  type ReviewSlideMetrics,
  type WhyWeAreSliderSlide,
} from "./whyWeAreSlideMetrics";

export type WhyWeAreSliderTransition = "next" | "prev";

export type WhyWeAreSliderProps = {
  slides: WhyWeAreSliderSlide[];
  allItems: ReviewItem[];
  transition: WhyWeAreSliderTransition | null;
  transitionId: number;
  withEnterSlide?: boolean;
  onSlideClick: (slot: number) => void;
  onSwipeNext: () => void;
  onSwipePrev: () => void;
  onTransitionEnd: () => void;
};

const SWIPE_THRESHOLD_PX = 48;
const SWIPE_ACTIVATION_PX = 8;

const WhyWeAreSlider: FC<WhyWeAreSliderProps> = ({
  slides,
  allItems,
  transition,
  transitionId,
  withEnterSlide = false,
  onSlideClick,
  onSwipeNext,
  onSwipePrev,
  onTransitionEnd,
}) => {
  const [metrics, setMetrics] = useState<ReviewSlideMetrics>(() =>
    buildReviewMetrics(REVIEW_SLIDE_METRICS_1920, 1920)
  );
  const [carouselHeight, setCarouselHeight] = useState(REVIEW_CAROUSEL_HEIGHT);
  const [runTransitionId, setRunTransitionId] = useState(0);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const pointerCapturedRef = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const onMaxHeightChange = useCallback((height: number) => {
    setCarouselHeight((prev) => (prev === height ? prev : height));
  }, []);

  useLayoutEffect(() => {
    const sliderEl = sliderRef.current;
    if (!sliderEl) return;

    const sync = () => {
      const viewportWidth = window.innerWidth;
      setMetrics(buildReviewMetrics(pickReviewMetricsBase(viewportWidth), viewportWidth));
    };

    sync();

    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(sliderEl);
    window.addEventListener("resize", sync);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", sync);
    };
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
    }, REVIEWS_SLIDE_TRANSITION_MS);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(timerId);
    };
  }, [transition, transitionId, onTransitionEnd]);

  const animPhase: "idle" | "start" | "run" =
    !transition || transitionId === 0 ? "idle" : runTransitionId === transitionId ? "run" : "start";

  const incomingActiveSlot = useMemo(() => {
    if (slides.length === 2) return 0;
    if (transition === "next") return 2;
    if (transition === "prev" && withEnterSlide) return 1;
    return 0;
  }, [slides.length, transition, withEnterSlide]);

  const getSlideHeight = useCallback(
    (slot: number, isActiveVisual: boolean) => {
      if (isActiveVisual) {
        return carouselHeight;
      }

      return metrics.inactiveH;
    },
    [carouselHeight, metrics.inactiveH]
  );

  const getSlideStyle = useCallback(
    (slot: number): CSSProperties => {
      if (transition) {
        const layouts =
          transition === "next"
            ? getNextReviewTransitionLayouts(slot, slides.length, metrics, carouselHeight)
            : getPrevReviewTransitionLayouts(
                slot,
                slides.length,
                metrics,
                carouselHeight,
                withEnterSlide
              );

        const layout = animPhase === "run" ? layouts.to : layouts.from;
        const isRunning = animPhase === "run";

        return {
          position: "absolute",
          left: layout.left,
          bottom: 0,
          width: layout.width,
          height: layout.height,
          opacity: layout.opacity,
          zIndex: slot === incomingActiveSlot ? 2 : 1,
          transition: isRunning
            ? `left ${REVIEWS_SLIDE_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), width ${REVIEWS_SLIDE_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), height ${REVIEWS_SLIDE_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${REVIEWS_SLIDE_TRANSITION_MS}ms ease-in-out`
            : "none",
        };
      }

      const isActiveVisual = slot === REVIEW_ACTIVE_SLOT;
      const layout = getReviewSlotLayout(
        slot,
        metrics,
        getSlideHeight(slot, isActiveVisual),
        isActiveVisual
      );

      return {
        position: "absolute",
        left: layout.left,
        bottom: 0,
        width: layout.width,
        height: layout.height,
        opacity: layout.opacity,
      };
    },
    [
      animPhase,
      carouselHeight,
      getSlideHeight,
      incomingActiveSlot,
      metrics,
      slides.length,
      transition,
      withEnterSlide,
    ]
  );

  const isOutgoingActive = useCallback(
    (slot: number) => {
      if (!transition) {
        return slot === REVIEW_ACTIVE_SLOT;
      }

      if (transition === "prev" && withEnterSlide) {
        return slot === 2;
      }

      return slot === REVIEW_ACTIVE_SLOT;
    },
    [transition, withEnterSlide]
  );

  const isIncomingActive = useCallback(
    (slot: number) => {
      if (!transition) {
        return slot === REVIEW_ACTIVE_SLOT;
      }

      return slot === incomingActiveSlot;
    },
    [incomingActiveSlot, transition]
  );

  const isAnimating = transition != null;

  const stableSlotCount = useMemo(() => {
    if (transition === "prev" && withEnterSlide && slides.length > 2) {
      return slides.length - 1;
    }

    return slides.length;
  }, [slides.length, transition, withEnterSlide]);

  const trackBounds = useMemo(() => {
    if (stableSlotCount <= 0) {
      return { width: 0 };
    }

    let minLeft = Infinity;
    let maxRight = -Infinity;

    for (let slot = 0; slot < stableSlotCount; slot += 1) {
      const isActive = slot === REVIEW_ACTIVE_SLOT;
      const layout = getReviewSlotLayout(slot, metrics, getSlideHeight(slot, isActive), isActive);

      minLeft = Math.min(minLeft, layout.left);
      maxRight = Math.max(maxRight, layout.left + layout.width);
    }

    return {
      width: maxRight - Math.min(minLeft, 0),
    };
  }, [getSlideHeight, metrics, stableSlotCount]);

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

  return (
    <div
      ref={sliderRef}
      className={classNames("home-page__why-we-are-slider", {
        "home-page__why-we-are-slider--animating": isAnimating,
      })}
      style={{ height: carouselHeight }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div
        ref={trackRef}
        className="home-page__why-we-are-slider__track"
        style={{
          position: "relative",
          height: carouselHeight,
          width: trackBounds.width,
        }}
      >
        <WhyWeAreReviewHeightProbe
          items={allItems}
          activeWidth={metrics.activeW}
          onMaxHeightChange={onMaxHeightChange}
        />
        {slides.map(({ item, key }, slot) => {
          const isOutgoing = isOutgoingActive(slot);
          const isIncoming = isIncomingActive(slot);
          const slideStyle = getSlideStyle(slot);

          return (
            <div
              key={key}
              className={classNames("home-page__why-we-are-slide", {
                "home-page__why-we-are-slide--active": isOutgoing,
                "home-page__why-we-are-slide--incoming-active": isIncoming && isAnimating,
                "home-page__why-we-are-slide--animating": isAnimating,
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
              <WhyWeAreReviewCard item={item} cardKey={key} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhyWeAreSlider;
