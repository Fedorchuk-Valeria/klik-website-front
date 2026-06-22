import type { TutorItem } from "./types";

export const TUTORS_SLIDE_TRANSITION_MS = 500;

export type TutorsSliderSlide = {
  item: TutorItem;
  key: string;
};

export type TutorSlideMetrics = {
  inactiveW: number;
  inactiveH: number;
  activeW: number;
  activeH: number;
  gap: number;
};

export const TUTOR_SLIDE_METRICS_1920: TutorSlideMetrics = {
  inactiveW: 270,
  inactiveH: 400,
  activeW: 560,
  activeH: 700,
  gap: 20,
};

export const TUTOR_SLIDE_METRICS_1440: TutorSlideMetrics = {
  inactiveW: 200,
  inactiveH: 298,
  activeW: 414,
  activeH: 518,
  gap: 16,
};

export const TUTOR_SLIDE_METRICS_1280: TutorSlideMetrics = {
  inactiveW: 218,
  inactiveH: 323,
  activeW: 452,
  activeH: 566,
  gap: 18,
};

export const TUTOR_DESKTOP_VIEWPORT_MAX = 1720;
export const TUTOR_DESKTOP_BREAKPOINT = 1440;
export const TUTOR_COMPACT_BREAKPOINT = 1280;
export const TUTOR_COMPACT_VIEWPORT_MAX = 1280;

export type TutorMetricsPreset = "wide" | "desktop1440" | "desktop1280";

const INACTIVE_ASPECT_RATIO_1920 =
  TUTOR_SLIDE_METRICS_1920.inactiveH / TUTOR_SLIDE_METRICS_1920.inactiveW;
const INACTIVE_ASPECT_RATIO_1440 =
  TUTOR_SLIDE_METRICS_1440.inactiveH / TUTOR_SLIDE_METRICS_1440.inactiveW;
const INACTIVE_ASPECT_RATIO_1280 =
  TUTOR_SLIDE_METRICS_1280.inactiveH / TUTOR_SLIDE_METRICS_1280.inactiveW;

export function getTutorMetricsPreset(
  matchesCompact1280: boolean,
  matchesCompact1440: boolean
): TutorMetricsPreset {
  if (matchesCompact1280) return "desktop1280";
  if (matchesCompact1440) return "desktop1440";
  return "wide";
}

/** На 1280 — 2 превью справа (всего 4 слайда: 3 неактивных + 1 активный). */
export function getMaxTutorsTailInView(preset: TutorMetricsPreset): number {
  return preset === "desktop1280" ? 2 : 3;
}

export function getTutorTrackWidth(slideCount: number, metrics: TutorSlideMetrics): number {
  if (slideCount <= 0) return 0;
  if (slideCount === 1) return metrics.activeW;

  const { inactiveW, activeW, gap } = metrics;
  const gapsCount = slideCount - 1;
  const inactiveSlots = slideCount - 1;

  return activeW + gapsCount * gap + inactiveSlots * inactiveW;
}

function fitMetricsToWidth(
  availableW: number,
  slideCount: number,
  base: TutorSlideMetrics,
  inactiveAspectRatio: number
): TutorSlideMetrics {
  if (slideCount <= 1 || availableW <= 0) {
    return base;
  }

  if (getTutorTrackWidth(slideCount, base) <= availableW) {
    return base;
  }

  const { activeW, activeH, gap } = base;
  const gapsCount = slideCount - 1;
  const inactiveSlots = slideCount - 1;
  const activeAspectRatio = activeH / activeW;

  const requiredInactiveW = (availableW - activeW - gapsCount * gap) / inactiveSlots;

  if (requiredInactiveW >= base.inactiveW) {
    return base;
  }

  if (requiredInactiveW >= 1) {
    const inactiveW = Math.floor(requiredInactiveW);
    return {
      ...base,
      inactiveW,
      inactiveH: Math.round(inactiveW * inactiveAspectRatio),
    };
  }

  const fittedActiveW = Math.max(1, availableW - gapsCount * gap - inactiveSlots);
  const nextActiveW = Math.min(activeW, Math.floor(fittedActiveW));

  return {
    ...base,
    inactiveW: 1,
    inactiveH: Math.round(inactiveAspectRatio),
    activeW: nextActiveW,
    activeH: Math.round(nextActiveW * activeAspectRatio),
    gap,
  };
}

/** Подгоняет превью под ширину контейнера; активный в wide-режиме держим в размере 1920, пока хватает места. */
export function resolveTutorSlideMetrics(
  viewportWidth: number,
  slideCount: number,
  preset: TutorMetricsPreset
): TutorSlideMetrics {
  if (viewportWidth <= 0) {
    switch (preset) {
      case "desktop1280":
        return TUTOR_SLIDE_METRICS_1280;
      case "desktop1440":
        return TUTOR_SLIDE_METRICS_1440;
      default:
        return TUTOR_SLIDE_METRICS_1920;
    }
  }

  switch (preset) {
    case "desktop1280":
      return fitMetricsToWidth(
        viewportWidth,
        slideCount,
        TUTOR_SLIDE_METRICS_1280,
        INACTIVE_ASPECT_RATIO_1280
      );
    case "desktop1440":
      return fitMetricsToWidth(
        viewportWidth,
        slideCount,
        TUTOR_SLIDE_METRICS_1440,
        INACTIVE_ASPECT_RATIO_1440
      );
    default:
      return fitMetricsToWidth(
        Math.min(viewportWidth, TUTOR_DESKTOP_VIEWPORT_MAX),
        slideCount,
        TUTOR_SLIDE_METRICS_1920,
        INACTIVE_ASPECT_RATIO_1920
      );
  }
}

export const DESKTOP_ACTIVE_SLOT = 1;

export type SlideLayout = {
  left: number;
  width: number;
  height: number;
  opacity: number;
};

export function getSlotLayout(
  slot: number,
  metrics: TutorSlideMetrics,
  activeSlot = DESKTOP_ACTIVE_SLOT
): SlideLayout {
  const { inactiveW, inactiveH, activeW, activeH, gap } = metrics;
  let left = 0;

  for (let i = 0; i < slot; i += 1) {
    left += (i === activeSlot ? activeW : inactiveW) + gap;
  }

  const isActive = slot === activeSlot;

  return {
    left,
    width: isActive ? activeW : inactiveW,
    height: isActive ? activeH : inactiveH,
    opacity: isActive ? 1 : 0.5,
  };
}

export function getNextTransitionLayouts(
  slot: number,
  slideCount: number,
  metrics: TutorSlideMetrics
): { from: SlideLayout; to: SlideLayout } {
  const from = getSlotLayout(slot, metrics);
  const { inactiveW, inactiveH, activeW, activeH, gap } = metrics;

  if (slideCount === 2) {
    if (slot === 0) {
      const toSlot = getSlotLayout(DESKTOP_ACTIVE_SLOT, metrics);
      return {
        from,
        to: {
          ...toSlot,
          width: activeW,
          height: activeH,
          opacity: 1,
        },
      };
    }

    if (slot === DESKTOP_ACTIVE_SLOT) {
      const toSlot = getSlotLayout(0, metrics);
      return {
        from,
        to: {
          ...toSlot,
          width: inactiveW,
          height: inactiveH,
          opacity: 0.5,
        },
      };
    }

    return { from, to: from };
  }

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

  if (slot === DESKTOP_ACTIVE_SLOT) {
    const toSlot = getSlotLayout(0, metrics);
    return {
      from,
      to: {
        ...toSlot,
        width: inactiveW,
        height: inactiveH,
        opacity: 0.5,
      },
    };
  }

  if (slot === 2) {
    const toSlot = getSlotLayout(DESKTOP_ACTIVE_SLOT, metrics);
    return {
      from,
      to: {
        ...toSlot,
        width: activeW,
        height: activeH,
        opacity: 1,
      },
    };
  }

  if (slot > 2) {
    const toSlot = getSlotLayout(slot - 1, metrics);
    return {
      from,
      to: {
        ...toSlot,
        width: inactiveW,
        height: inactiveH,
        opacity: 0.5,
      },
    };
  }

  return { from, to: from };
}

export function getPrevTransitionLayouts(
  slot: number,
  slideCount: number,
  metrics: TutorSlideMetrics,
  withEnterSlide = false
): { from: SlideLayout; to: SlideLayout } {
  const { inactiveW, inactiveH, activeW, activeH, gap } = metrics;

  if (withEnterSlide && slideCount > 2) {
    if (slot === 0) {
      const toSlot = getSlotLayout(0, metrics);
      return {
        from: {
          left: -(inactiveW + gap),
          width: inactiveW,
          height: inactiveH,
          opacity: 0,
        },
        to: {
          ...toSlot,
          opacity: 0.5,
        },
      };
    }

    if (slot === 1) {
      const fromSlot = getSlotLayout(0, metrics);
      const toSlot = getSlotLayout(DESKTOP_ACTIVE_SLOT, metrics);
      return {
        from: fromSlot,
        to: {
          ...toSlot,
          width: activeW,
          height: activeH,
          opacity: 1,
        },
      };
    }

    const visualFromSlot = slot - 1;
    const from = getSlotLayout(visualFromSlot, metrics);

    if (slot === 2) {
      const toSlot = getSlotLayout(2, metrics);
      return {
        from,
        to: {
          ...toSlot,
          width: inactiveW,
          height: inactiveH,
          opacity: 0.5,
        },
      };
    }

    if (slot + 1 >= slideCount) {
      return {
        from,
        to: {
          left: from.left + inactiveW + gap,
          width: inactiveW,
          height: inactiveH,
          opacity: 0,
        },
      };
    }

    const toSlot = getSlotLayout(slot, metrics);
    return {
      from,
      to: {
        ...toSlot,
        width: inactiveW,
        height: inactiveH,
        opacity: 0.5,
      },
    };
  }

  const from = getSlotLayout(slot, metrics);

  if (slideCount === 2) {
    if (slot === 0) {
      const toSlot = getSlotLayout(DESKTOP_ACTIVE_SLOT, metrics);
      return {
        from,
        to: {
          ...toSlot,
          width: activeW,
          height: activeH,
          opacity: 1,
        },
      };
    }

    if (slot === DESKTOP_ACTIVE_SLOT) {
      const toSlot = getSlotLayout(0, metrics);
      return {
        from,
        to: {
          ...toSlot,
          width: inactiveW,
          height: inactiveH,
          opacity: 0.5,
        },
      };
    }

    return { from, to: from };
  }

  if (slot === 0) {
    const toSlot = getSlotLayout(DESKTOP_ACTIVE_SLOT, metrics);
    return {
      from,
      to: {
        ...toSlot,
        width: activeW,
        height: activeH,
        opacity: 1,
      },
    };
  }

  if (slot === DESKTOP_ACTIVE_SLOT) {
    const toSlot = getSlotLayout(2, metrics);
    return {
      from,
      to: {
        ...toSlot,
        width: inactiveW,
        height: inactiveH,
        opacity: 0.5,
      },
    };
  }

  if (slot >= 2) {
    if (slot + 1 >= slideCount) {
      return {
        from,
        to: {
          left: from.left + inactiveW + gap,
          width: inactiveW,
          height: inactiveH,
          opacity: 0,
        },
      };
    }

    const toSlot = getSlotLayout(slot + 1, metrics);
    return {
      from,
      to: {
        ...toSlot,
        width: inactiveW,
        height: inactiveH,
        opacity: 0.5,
      },
    };
  }

  return { from, to: from };
}
