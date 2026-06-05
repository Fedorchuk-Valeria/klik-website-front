"use client";

import classNames from "classnames";
import {
  CSSProperties,
  FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import WhyWeAreReviewCard from "./WhyWeAreReviewCard";
import {
  buildReviewMetrics,
  getNextReviewTransitionLayouts,
  getPrevReviewTransitionLayouts,
  getReviewSlotLayout,
  REVIEW_ACTIVE_SLOT,
  REVIEW_CAROUSEL_HEIGHT,
  REVIEW_SLIDE_METRICS_1440,
  REVIEW_SLIDE_METRICS_1920,
  REVIEWS_SLIDE_TRANSITION_MS,
  type ReviewSlideMetrics,
  type WhyWeAreSliderSlide,
} from "./whyWeAreSlideMetrics";

export type WhyWeAreSliderTransition = "next" | "prev";

export type WhyWeAreSliderProps = {
  slides: WhyWeAreSliderSlide[];
  transition: WhyWeAreSliderTransition | null;
  transitionId: number;
  withEnterSlide?: boolean;
  activeHeights: Record<string, number>;
  onSlideClick: (slot: number) => void;
  onSwipeNext: () => void;
  onSwipePrev: () => void;
  onTransitionEnd: () => void;
  onMeasureActiveHeight: (itemId: string, height: number) => void;
};

const SWIPE_THRESHOLD_PX = 48;

const WhyWeAreSlider: FC<WhyWeAreSliderProps> = ({
  slides,
  transition,
  transitionId,
  withEnterSlide = false,
  activeHeights,
  onSlideClick,
  onSwipeNext,
  onSwipePrev,
  onTransitionEnd,
  onMeasureActiveHeight,
}) => {
  const [metrics, setMetrics] = useState<ReviewSlideMetrics>(() =>
    buildReviewMetrics(REVIEW_SLIDE_METRICS_1920, 1920)
  );
  const [animPhase, setAnimPhase] = useState<"idle" | "start" | "run">("idle");
  const pointerStartXRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useLayoutEffect(() => {
    const sliderEl = sliderRef.current;
    if (!sliderEl) return;

    const mq = window.matchMedia("(max-width: 1440px)");

    const sync = () => {
      const base = mq.matches ? REVIEW_SLIDE_METRICS_1440 : REVIEW_SLIDE_METRICS_1920;
      const viewportWidth = window.innerWidth;
      setMetrics(buildReviewMetrics(base, viewportWidth));
    };

    sync();

    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(sliderEl);
    mq.addEventListener("change", sync);

    return () => {
      resizeObserver.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, []);

  useLayoutEffect(() => {
    if (transition) return;

    const activeSlide = slides[REVIEW_ACTIVE_SLOT];
    if (!activeSlide) return;

    const el = itemRefs.current.get(activeSlide.key);
    if (!el) return;

    const height = Math.round(el.getBoundingClientRect().height);
    if (height > 0) {
      onMeasureActiveHeight(activeSlide.item.id, height);
    }
  }, [slides, transition, onMeasureActiveHeight]);

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

  const incomingActiveSlot = useMemo(() => {
    if (slides.length === 2) return 0;
    if (transition === "next") return 2;
    if (transition === "prev" && withEnterSlide) return 1;
    return 0;
  }, [slides.length, transition, withEnterSlide]);

  const getSlideHeight = useCallback(
    (slot: number, isActiveVisual: boolean) => {
      const slideItem = slides[slot]?.item;

      if (isActiveVisual) {
        return REVIEW_CAROUSEL_HEIGHT;
      }

      return metrics.inactiveH;
    },
    [metrics.inactiveH]
  );

  const getSlideStyle = useCallback(
    (slot: number): CSSProperties => {
      if (transition) {
        const layouts =
          transition === "next"
            ? getNextReviewTransitionLayouts(
                slot,
                slides.length,
                metrics,
                activeHeights,
                slides
              )
            : getPrevReviewTransitionLayouts(
                slot,
                slides.length,
                metrics,
                activeHeights,
                slides,
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
      activeHeights,
      animPhase,
      getSlideHeight,
      incomingActiveSlot,
      metrics,
      slides,
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
      const layout = getReviewSlotLayout(
        slot,
        metrics,
        getSlideHeight(slot, isActive),
        isActive
      );

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
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [transition]
  );

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

  return (
    <div
      ref={sliderRef}
      className={classNames("home-page__why-we-are-slider", {
        "home-page__why-we-are-slider--animating": isAnimating,
      })}
      style={{ height: REVIEW_CAROUSEL_HEIGHT }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div
        ref={trackRef}
        className="home-page__why-we-are-slider__track"
        style={{
          position: "relative",
          height: REVIEW_CAROUSEL_HEIGHT,
          width: trackBounds.width,
        }}
      >
        {slides.map(({ item, key }, slot) => {
          const isOutgoing = isOutgoingActive(slot);
          const isIncoming = isIncomingActive(slot);
          const slideStyle = getSlideStyle(slot);

          return (
            <div
              key={key}
              className={classNames("home-page__why-we-are-slide", {
                "home-page__why-we-are-slide--active": isOutgoing,
                "home-page__why-we-are-slide--incoming-active":
                  isIncoming && isAnimating,
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
              <WhyWeAreReviewCard
                item={item}
                cardKey={key}
                ref={(node) => {
                  if (node) {
                    itemRefs.current.set(key, node);
                  } else {
                    itemRefs.current.delete(key);
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhyWeAreSlider;
