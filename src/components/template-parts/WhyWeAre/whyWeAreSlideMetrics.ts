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
  inactiveW: number;
  activeW: number;
  inactiveH: number;
  gap: number;
  centerOffset: number;
  defaultActiveH: number;
};

export type ReviewSlideMetricsBase = Omit<ReviewSlideMetrics, "centerOffset">;

export const REVIEW_SLIDE_METRICS_1920: ReviewSlideMetricsBase = {
  inactiveW: 770,
  activeW: 770,
  inactiveH: 224,
  gap: 40,
  defaultActiveH: REVIEW_CAROUSEL_HEIGHT,
};

export const REVIEW_SLIDE_METRICS_1440: ReviewSlideMetricsBase = {
  inactiveW: 770,
  activeW: 770,
  inactiveH: 224,
  gap: 20,
  defaultActiveH: REVIEW_CAROUSEL_HEIGHT,
};

export const REVIEW_SLIDE_METRICS_1280: ReviewSlideMetricsBase = {
  inactiveW: 770,
  activeW: 700,
  inactiveH: 171,
  gap: 20,
  defaultActiveH: REVIEW_CAROUSEL_HEIGHT,
};

export const REVIEW_SLIDE_METRICS_960: ReviewSlideMetricsBase = {
  inactiveW: 770,
  activeW: 586,
  inactiveH: 134,
  gap: 10,
  defaultActiveH: REVIEW_CAROUSEL_HEIGHT,
};

export type SlideLayout = {
  left: number;
  width: number;
  height: number;
  opacity: number;
};

export function pickReviewMetricsBase(viewportW: number): ReviewSlideMetricsBase {
  if (viewportW <= 960) return REVIEW_SLIDE_METRICS_960;
  if (viewportW <= 1280) return REVIEW_SLIDE_METRICS_1280;
  if (viewportW <= 1440) return REVIEW_SLIDE_METRICS_1440;
  return REVIEW_SLIDE_METRICS_1920;
}

export function buildReviewMetrics(
  base: ReviewSlideMetricsBase,
  viewportW: number
): ReviewSlideMetrics {
  return {
    ...base,
    centerOffset: Math.round((viewportW - base.activeW) / 2),
  };
}

function getInactiveStep(metrics: ReviewSlideMetrics) {
  return metrics.inactiveW + metrics.gap;
}

function resolveActiveHeight(activeHeight: number) {
  return activeHeight;
}

function getReviewSlotLeft(
  slot: number,
  metrics: ReviewSlideMetrics,
  activeSlot = REVIEW_ACTIVE_SLOT
): number {
  const { inactiveW, activeW, gap, centerOffset } = metrics;

  if (slot === activeSlot) {
    return centerOffset;
  }

  if (slot < activeSlot) {
    let left = centerOffset - gap - inactiveW;
    for (let i = activeSlot - 2; i >= slot; i -= 1) {
      left -= gap + inactiveW;
    }
    return left;
  }

  let left = centerOffset + activeW + gap;
  for (let i = activeSlot + 1; i < slot; i += 1) {
    left += inactiveW + gap;
  }
  return left;
}

export function getReviewSlotLayout(
  slot: number,
  metrics: ReviewSlideMetrics,
  height: number,
  isActiveVisual: boolean,
  activeSlot = REVIEW_ACTIVE_SLOT
): SlideLayout {
  return {
    left: getReviewSlotLeft(slot, metrics, activeSlot),
    width: isActiveVisual ? metrics.activeW : metrics.inactiveW,
    height,
    opacity: 1,
  };
}

export function getNextReviewTransitionLayouts(
  slot: number,
  slideCount: number,
  metrics: ReviewSlideMetrics,
  activeHeight: number
): { from: SlideLayout; to: SlideLayout } {
  const { inactiveH, inactiveW } = metrics;
  const step = getInactiveStep(metrics);
  const outgoingH = resolveActiveHeight(activeHeight);
  const incomingH = resolveActiveHeight(activeHeight);

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
        width: inactiveW,
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
          width: inactiveW,
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
  activeHeight: number,
  withEnterSlide = false
): { from: SlideLayout; to: SlideLayout } {
  const { inactiveH, inactiveW } = metrics;
  const step = getInactiveStep(metrics);
  const outgoingH = resolveActiveHeight(activeHeight);
  const incomingH = resolveActiveHeight(activeHeight);

  if (withEnterSlide && slideCount > 2) {
    if (slot === 0) {
      const toSlot = getReviewSlotLayout(0, metrics, inactiveH, false);
      return {
        from: {
          left: toSlot.left - step,
          width: inactiveW,
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
          width: inactiveW,
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
          width: inactiveW,
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
