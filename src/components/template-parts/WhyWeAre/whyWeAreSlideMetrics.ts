export const REVIEWS_SLIDE_TRANSITION_MS = 500;
export const REVIEW_ACTIVE_SLOT = 1;
export const REVIEW_CAROUSEL_HEIGHT = 450;

export type ReviewItem = {
  id: string;
  title: string;
  text: string;
  star: number;
  fullName: string;
  position: string;
  createdAt: string;
};

export type WhyWeAreSliderSlide = {
  item: ReviewItem;
  key: string;
};

export type ReviewSlideMetrics = {
  slideW: number;
  inactiveH: number;
  gap: number;
  centerOffset: number;
  defaultActiveH: number;
};

export const REVIEW_SLIDE_METRICS_1920: Omit<ReviewSlideMetrics, "centerOffset"> = {
  slideW: 770,
  inactiveH: 224,
  gap: 40,
  defaultActiveH: REVIEW_CAROUSEL_HEIGHT,
};

export const REVIEW_SLIDE_METRICS_1440: Omit<ReviewSlideMetrics, "centerOffset"> = {
  slideW: 770,
  inactiveH: 224,
  gap: 20,
  defaultActiveH: REVIEW_CAROUSEL_HEIGHT,
};

export type SlideLayout = {
  left: number;
  width: number;
  height: number;
  opacity: number;
};

export function buildReviewMetrics(
  base: Omit<ReviewSlideMetrics, "centerOffset">,
  viewportW: number
): ReviewSlideMetrics {
  return {
    ...base,
    centerOffset: Math.round((viewportW - base.slideW) / 2),
  };
}

function getStep(metrics: ReviewSlideMetrics) {
  return metrics.slideW + metrics.gap;
}

function resolveActiveHeight() {
  return REVIEW_CAROUSEL_HEIGHT;
}

export function getReviewSlotLayout(
  slot: number,
  metrics: ReviewSlideMetrics,
  height: number,
  isActiveVisual: boolean,
  activeSlot = REVIEW_ACTIVE_SLOT
): SlideLayout {
  const step = getStep(metrics);
  const left = metrics.centerOffset + (slot - activeSlot) * step;

  return {
    left,
    width: metrics.slideW,
    height,
    opacity: 1,
  };
}

export function getNextReviewTransitionLayouts(
  slot: number,
  slideCount: number,
  metrics: ReviewSlideMetrics,
  heights: Record<string, number>,
  slides: WhyWeAreSliderSlide[]
): { from: SlideLayout; to: SlideLayout } {
  const { inactiveH, defaultActiveH } = metrics;
  const step = getStep(metrics);
  const outgoingItem = slides[REVIEW_ACTIVE_SLOT]?.item;
  const incomingItem = slides[2]?.item;
  const outgoingH = resolveActiveHeight();
  const incomingH = resolveActiveHeight();

  if (slideCount === 2) {
    const from0 = getReviewSlotLayout(0, metrics, inactiveH, false);
    const from1 = getReviewSlotLayout(1, metrics, outgoingH, true);

    if (slot === 0) {
      const toSlot = getReviewSlotLayout(REVIEW_ACTIVE_SLOT, metrics, incomingH, true);
      return { from: from0, to: toSlot };
    }

    if (slot === REVIEW_ACTIVE_SLOT) {
      const toSlot = getReviewSlotLayout(0, metrics, inactiveH, false);
      return { from: from1, to: toSlot };
    }

    return { from: from0, to: from0 };
  }

  const from = getReviewSlotLayout(
    slot,
    metrics,
    slot === REVIEW_ACTIVE_SLOT ? outgoingH : inactiveH,
    slot === REVIEW_ACTIVE_SLOT
  );

  if (slot === 0) {
    return {
      from,
      to: {
        left: from.left,
        width: metrics.slideW,
        height: inactiveH,
        opacity: 0,
      },
    };
  }

  if (slot === REVIEW_ACTIVE_SLOT) {
    const toSlot = getReviewSlotLayout(0, metrics, inactiveH, false);
    return { from, to: toSlot };
  }

  if (slot === 2) {
    const toSlot = getReviewSlotLayout(REVIEW_ACTIVE_SLOT, metrics, incomingH, true);
    return { from, to: toSlot };
  }

  if (slot > 2) {
    if (slot + 1 >= slideCount) {
      return {
        from,
        to: {
          left: from.left + step,
          width: metrics.slideW,
          height: inactiveH,
          opacity: 0,
        },
      };
    }

    const toSlot = getReviewSlotLayout(slot - 1, metrics, inactiveH, false);
    return { from, to: toSlot };
  }

  return { from, to: from };
}

export function getPrevReviewTransitionLayouts(
  slot: number,
  slideCount: number,
  metrics: ReviewSlideMetrics,
  heights: Record<string, number>,
  slides: WhyWeAreSliderSlide[],
  withEnterSlide = false
): { from: SlideLayout; to: SlideLayout } {
  const { inactiveH, defaultActiveH } = metrics;
  const step = getStep(metrics);
  const outgoingItem = withEnterSlide
    ? slides[2]?.item
    : slides[REVIEW_ACTIVE_SLOT]?.item;
  const incomingItem = withEnterSlide ? slides[1]?.item : slides[0]?.item;
  const outgoingH = resolveActiveHeight();
  const incomingH = resolveActiveHeight();

  if (withEnterSlide && slideCount > 2) {
    if (slot === 0) {
      const toSlot = getReviewSlotLayout(0, metrics, inactiveH, false);
      return {
        from: {
          left: toSlot.left - step,
          width: metrics.slideW,
          height: inactiveH,
          opacity: 0,
        },
        to: toSlot,
      };
    }

    if (slot === 1) {
      const fromSlot = getReviewSlotLayout(0, metrics, inactiveH, false);
      const toSlot = getReviewSlotLayout(REVIEW_ACTIVE_SLOT, metrics, incomingH, true);
      return { from: fromSlot, to: toSlot };
    }

    const visualFromSlot = slot - 1;
    const from = getReviewSlotLayout(
      visualFromSlot,
      metrics,
      visualFromSlot === REVIEW_ACTIVE_SLOT ? outgoingH : inactiveH,
      visualFromSlot === REVIEW_ACTIVE_SLOT
    );

    if (slot === 2) {
      const toSlot = getReviewSlotLayout(2, metrics, inactiveH, false);
      return { from, to: toSlot };
    }

    if (slot + 1 >= slideCount) {
      return {
        from,
        to: {
          left: from.left + step,
          width: metrics.slideW,
          height: inactiveH,
          opacity: 0,
        },
      };
    }

    const toSlot = getReviewSlotLayout(slot, metrics, inactiveH, false);
    return { from, to: toSlot };
  }

  if (slideCount === 2) {
    const from0 = getReviewSlotLayout(0, metrics, inactiveH, false);
    const from1 = getReviewSlotLayout(1, metrics, outgoingH, true);

    if (slot === 0) {
      const toSlot = getReviewSlotLayout(REVIEW_ACTIVE_SLOT, metrics, incomingH, true);
      return { from: from0, to: toSlot };
    }

    if (slot === REVIEW_ACTIVE_SLOT) {
      const toSlot = getReviewSlotLayout(0, metrics, inactiveH, false);
      return { from: from1, to: toSlot };
    }

    return { from: from0, to: from0 };
  }

  const from = getReviewSlotLayout(
    slot,
    metrics,
    slot === REVIEW_ACTIVE_SLOT ? outgoingH : inactiveH,
    slot === REVIEW_ACTIVE_SLOT
  );

  if (slot === 0) {
    const toSlot = getReviewSlotLayout(REVIEW_ACTIVE_SLOT, metrics, incomingH, true);
    return { from, to: toSlot };
  }

  if (slot === REVIEW_ACTIVE_SLOT) {
    const toSlot = getReviewSlotLayout(2, metrics, inactiveH, false);
    return { from, to: toSlot };
  }

  if (slot >= 2) {
    if (slot + 1 >= slideCount) {
      return {
        from,
        to: {
          left: from.left + step,
          width: metrics.slideW,
          height: inactiveH,
          opacity: 0,
        },
      };
    }

    const toSlot = getReviewSlotLayout(slot + 1, metrics, inactiveH, false);
    return { from, to: toSlot };
  }

  return { from, to: from };
}
