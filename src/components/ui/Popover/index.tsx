/* eslint-disable react-hooks/refs */
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

  const timer = useRef<number | null>(null);

  const handleLeave = () => {
    clearTimer();

    timer.current = window.setTimeout(() => {
      setOpen(false);
    }, 120);
  };

  const clearTimer = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };

  const isInDialog = () => {
    return !!wrapperRef.current?.closest("dialog");
  };

  const getPortalTarget = () => {
    if (typeof document === "undefined") return null;

    return wrapperRef.current?.closest("dialog") ?? document.body;
  };

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

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

    const dialog = triggerRef.current.closest("dialog");

    if (dialog) {
      const d = dialog.getBoundingClientRect();
      x = x - d.left;
      y = y - d.top;
    }

    setPos({ x, y });
  }, [positionX, positionY]);

  useLayoutEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updatePosition();
      });
    });
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  const show = () => {
    clearTimer();
    setOpen(true);
  };

  const hide = () => {
    clearTimer();
    setOpen(false);
  };

  const toggle = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((v) => !v);
  };

  const portalTarget = open ? getPortalTarget() : null;

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
              isInDialog() ? "popover--absolute" : "popover--fixed",
              popoverClassName
            )}
            style={{
              left: pos.x,
              top: pos.y,
              position: isInDialog() ? "absolute" : "fixed",
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

export default memo(Popover);
