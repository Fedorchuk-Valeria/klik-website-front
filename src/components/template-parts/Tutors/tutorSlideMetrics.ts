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
  inactiveH: 296,
  activeW: 414,
  activeH: 518,
  gap: 20,
};

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
        left: -(inactiveW + gap),
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
