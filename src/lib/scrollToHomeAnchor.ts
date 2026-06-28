import { SET_ACTIVE_ANCHOR_EVENT } from "@/src/utils/constant";

type ScrollToHomeAnchorOptions = {
  behavior?: ScrollBehavior;
  announce?: boolean;
  updateHash?: boolean;
};

export function scrollToHomeAnchor(id: string, options: ScrollToHomeAnchorOptions = {}): boolean {
  const element = document.getElementById(id);
  if (!element) return false;

  element.scrollIntoView({ behavior: options.behavior ?? "smooth", block: "start" });

  if (options.updateHash) {
    window.history.pushState(null, "", `#${id}`);
  }

  if (options.announce) {
    window.dispatchEvent(new CustomEvent(SET_ACTIVE_ANCHOR_EVENT, { detail: { id } }));
  }

  return true;
}

export function scrollToHomeAnchorWhenReady(
  id: string,
  options: ScrollToHomeAnchorOptions = {},
): void {
  if (scrollToHomeAnchor(id, options)) return;

  let frames = 0;
  const maxFrames = 240;

  const tick = () => {
    if (scrollToHomeAnchor(id, options)) return;

    frames += 1;
    if (frames < maxFrames) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

export function navigateToHomeAnchorFromMobileMenu(id: string, onClose?: () => void): void {
  onClose?.();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToHomeAnchor(id, { behavior: "smooth", updateHash: true, announce: true });
    });
  });
}
