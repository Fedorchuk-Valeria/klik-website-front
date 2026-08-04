import classNames from "classnames";
import {
  FC,
  memo,
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Props = {
  children: ReactElement;
  content: ReactNode;
  className?: string;
  popoverClassName?: string;
  variant?: "click" | "hover" | "none";
  positionX?: "left" | "middle" | "right";
  positionY?: "top" | "bottom";
};

type Pos = { x: number; y: number };

type Bounds = { left: number; top: number; right: number; bottom: number };

const VIEWPORT_PADDING = 8;

const Popover: FC<Props> = ({
  children,
  content,
  className,
  popoverClassName,
  variant = "hover",
  positionX = "middle",
  positionY = "bottom",
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const [inDialog, setInDialog] = useState(false);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  const timer = useRef<number | null>(null);
  const positionFrame = useRef<number | null>(null);
  const posRef = useRef<Pos>({ x: 0, y: 0 });
  const isPositionedRef = useRef(false);

  const clearTimer = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };

  const resetPositioned = () => {
    isPositionedRef.current = false;
    setIsPositioned(false);
  };

  const markPositioned = () => {
    if (isPositionedRef.current) return;

    isPositionedRef.current = true;
    setIsPositioned(true);
  };

  const applyPosition = (next: Pos) => {
    if (next.x === posRef.current.x && next.y === posRef.current.y) return;

    posRef.current = next;
    setPos(next);
  };

  const prepareOpen = () => {
    clearTimer();
    resetPositioned();
  };

  const closePopover = () => {
    resetPositioned();
    setOpen(false);
  };

  const handleLeave = () => {
    clearTimer();

    timer.current = window.setTimeout(closePopover, 120);
  };

  const syncPortalContext = () => {
    const dialog = wrapperRef.current?.closest("dialog") ?? null;

    setInDialog(!!dialog);
    setPortalTarget(dialog ?? (typeof document !== "undefined" ? document.body : null));
  };

  const clearPositionFrame = () => {
    if (positionFrame.current !== null) {
      cancelAnimationFrame(positionFrame.current);
      positionFrame.current = null;
    }
  };

  const updatePosition = useCallback((): boolean => {
    if (!triggerRef.current || !popoverRef.current) return false;

    const rect = triggerRef.current.getBoundingClientRect();
    const dialog = triggerRef.current.closest("dialog");
    const { x, y } = getAnchorPosition(rect, positionX, positionY, dialog);

    const popover = popoverRef.current;
    const width = popover.offsetWidth;
    const height = popover.offsetHeight;

    if (!width || !height) return false;

    applyPosition(clampToBounds(x, y, width, height, getBounds(dialog)));
    markPositioned();

    return true;
  }, [positionX, positionY]);

  const schedulePositionUpdate = useCallback(() => {
    clearPositionFrame();

    const run = () => {
      if (updatePosition()) return;

      positionFrame.current = requestAnimationFrame(run);
    };

    run();
  }, [updatePosition]);

  useLayoutEffect(() => {
    if (!open) {
      clearPositionFrame();
      return;
    }

    syncPortalContext();
    schedulePositionUpdate();

    return clearPositionFrame;
  }, [open, schedulePositionUpdate]);

  useEffect(() => {
    if (!open) return;

    const handleUpdate = () => schedulePositionUpdate();

    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
    };
  }, [open, schedulePositionUpdate]);

  const show = () => {
    prepareOpen();
    setOpen(true);
  };

  const hide = () => {
    clearTimer();
    setOpen(false);
  };

  const toggle = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (open) {
      setOpen(false);
      return;
    }

    prepareOpen();
    setOpen(true);
  };

  return (
    <div ref={wrapperRef} className={classNames("popover", className)}>
      <div
        ref={triggerRef}
        className="popover__trigger"
        onMouseEnter={show}
        onMouseLeave={handleLeave}
        onClick={variant === "click" ? toggle : undefined}
      >
        {children}
      </div>

      {open &&
        portalTarget &&
        createPortal(
          <div
            className={classNames(
              "popover__content",
              inDialog ? "popover--absolute" : "popover--fixed",
              popoverClassName
            )}
            style={{
              left: pos.x,
              top: pos.y,
              position: inDialog ? "absolute" : "fixed",
              visibility: isPositioned ? "visible" : "hidden",
            }}
            ref={popoverRef}
            onMouseEnter={clearTimer}
            onMouseLeave={handleLeave}
          >
            {content}
          </div>,
          portalTarget
        )}
    </div>
  );
};

function clampToBounds(x: number, y: number, width: number, height: number, bounds: Bounds) {
  return {
    x: Math.min(Math.max(x, bounds.left), Math.max(bounds.left, bounds.right - width)),
    y: Math.min(Math.max(y, bounds.top), Math.max(bounds.top, bounds.bottom - height)),
  };
}

function getBounds(dialog: Element | null): Bounds {
  const width = dialog ? dialog.clientWidth : window.innerWidth;
  const height = dialog ? dialog.clientHeight : window.innerHeight;

  return {
    left: VIEWPORT_PADDING,
    top: VIEWPORT_PADDING,
    right: width - VIEWPORT_PADDING,
    bottom: height - VIEWPORT_PADDING,
  };
}

function getAnchorPosition(
  rect: DOMRect,
  positionX: Props["positionX"],
  positionY: Props["positionY"],
  dialog: Element | null
) {
  let x = rect.left;
  let y = rect.bottom;

  if (positionX === "middle") {
    x = rect.left + rect.width / 2;
  } else if (positionX === "right") {
    x = rect.right;
  }

  if (positionY === "top") {
    y = rect.top;
  }

  if (dialog) {
    const d = dialog.getBoundingClientRect();
    x -= d.left;
    y -= d.top;
  }

  return { x, y };
}

export default memo(Popover);
