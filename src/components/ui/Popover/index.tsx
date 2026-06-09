import classNames from "classnames";
import {
  FC,
  memo,
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type XPositionType =
  | "left"
  | "content-start"
  | "content-end"
  | "middle-left"
  | "middle"
  | "middle-right"
  | "right";
export type YPositionType = "top" | "middle" | "bottom" | "bottom-start" | "bottom-end";

type PropTypes = {
  children: ReactElement;
  className?: string;
  content: ReactNode;
  id: string;
  isStaticPosition?: boolean;
  isTablet?: boolean;
  onStateChange?: (isVisibile: boolean) => void;
  popoverClassName?: string;
  positionX?: XPositionType;
  positionY?: YPositionType;
  variant?: "click" | "hover" | "none";
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "children" | "content"
>;

const Popover: FC<PropTypes> = ({
  id,
  content,
  children,
  className,
  variant = "hover",
  positionY = "top",
  positionX = "middle",
  popoverClassName,
  onStateChange,
  isStaticPosition,
  ...props
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isVisible, setVisible] = useState(false);
  const [contentPosition, setContentPosition] = useState({ x: 0, y: 0 });

  const renderId = `popover-${id}`;

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current !== null) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const handleHideImmediate = useCallback(() => {
    clearLeaveTimer();
    setVisible(false);
  }, [clearLeaveTimer]);

  const scheduleLeaveHide = useCallback(() => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      leaveTimerRef.current = null;
      setVisible(false);
    }, 150);
  }, [clearLeaveTimer]);

  const handleShow = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      clearLeaveTimer();
      setVisible(true);
    },
    [clearLeaveTimer]
  );

  const toggleVisibility = (event: SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();

    clearLeaveTimer();
    setVisible((prevState) => !prevState);
  };

  const updateContentPosition = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const contentRect = document.body
        .querySelector(`#popover-content-${id}`)
        ?.getBoundingClientRect();
      const controlRect = ref.current
        ?.querySelector(`#popover-control-${id}`)
        ?.getBoundingClientRect();

      const scroller = document?.getElementsByClassName("fc-scroller fc-scroller-liquid-absolute");
      const container = scroller[scroller.length - 1] as HTMLElement;

      const scrollX = container ? container.scrollLeft : window.scrollX;
      const scrollY = container ? container.scrollTop : window.scrollY;

      setContentPosition({
        x: getXPosition(positionX, rect, contentRect, controlRect, scrollX, isStaticPosition),
        y: getYPosition(positionY, rect, contentRect, controlRect, isStaticPosition, scrollY),
      });
    }
  }, [id, positionX, positionY, isStaticPosition]);

  useEffect(() => {
    updateContentPosition();
  }, [updateContentPosition]);

  useEffect(() => {
    const scroller = document?.getElementsByClassName("fc-scroller fc-scroller-liquid-absolute");
    const container = scroller[scroller.length - 1] as HTMLElement;

    if (isVisible) {
      updateContentPosition();

      container?.addEventListener("scroll", updateContentPosition);
      window.addEventListener("scroll", updateContentPosition);
      window.addEventListener("resize", updateContentPosition);
    }

    if (onStateChange) onStateChange(isVisible);

    return () => {
      container?.removeEventListener("scroll", updateContentPosition);
      window.removeEventListener("scroll", updateContentPosition);
      window.removeEventListener("resize", updateContentPosition);
    };
  }, [isVisible, updateContentPosition, onStateChange]);

  useEffect(() => {
    return () => clearLeaveTimer();
  }, [clearLeaveTimer]);

  useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      const portalEl = document.getElementById(`popover-content-${id}`);
      if (portalEl?.contains(target)) return;
      handleHideImmediate();
    }

    document.addEventListener("click", onDocumentClick, true);

    return () => {
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [id, handleHideImmediate]);

  return (
    <div
      id={renderId}
      className={classNames("popover", className)}
      ref={ref}
      onMouseDown={(e) => e.preventDefault()}
      {...(variant === "click" && { onClick: toggleVisibility })}
      {...(variant === "hover" && {
        onMouseEnter: handleShow,
        onTouchStart: handleShow,
      })}
      {...(variant !== "none" && {
        onMouseLeave: variant === "hover" ? scheduleLeaveHide : handleHideImmediate,
      })}
      {...props}
    >
      <div
        aria-haspopup="true"
        aria-expanded={isVisible}
        id={`popover-control-${id}`}
        aria-controls={renderId}
        className={"popover__trigger"}
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            id={`popover-content-${id}`}
            className={classNames(
              "popover__content",
              `popover__content__x-${positionX}`,
              `popover__content__y-${positionY}`,
              popoverClassName
            )}
            style={{
              top: contentPosition.y,
              left: contentPosition.x,
            }}
            {...(variant === "hover" && {
              onMouseEnter: clearLeaveTimer,
              onMouseLeave: scheduleLeaveHide,
            })}
          >
            {content}
          </div>,
          document.querySelector("body") as Element
        )}
    </div>
  );
};

export function getXPosition(
  positionX: XPositionType,
  rect: DOMRect,
  contentRect: DOMRect | undefined,
  controlRect: DOMRect | undefined,
  scrollX: number = window.scrollX,
  isStaticPosition?: boolean
) {
  let result = isStaticPosition ? rect.left + scrollX : rect.left;

  if (positionX === "left") {
    result -= Math.floor((contentRect?.width || 0) + 4);
  }
  if (positionX === "middle-left") {
    result -= Math.floor((contentRect?.width || 0) - 8);
  }
  if (positionX === "middle") {
    result -= Math.floor(contentRect?.width || 0) / 2 - Math.floor(controlRect?.width || 0) / 2;
  }
  if (positionX === "middle-right") {
    result += Math.floor((controlRect?.width || 0) + 5) / 2;
  }
  if (positionX === "right") {
    result += Math.floor((controlRect?.width || 0) + 5);
  }
  if (positionX === "content-end") {
    result =
      rect.left - (Math.floor(contentRect?.width || 0) - Math.floor(controlRect?.width || 0));
  }

  if (isStaticPosition) {
    if (result < scrollX) result = scrollX;
    if (window.innerWidth + scrollX < result + (contentRect?.width || 0)) {
      result = window.innerWidth + scrollX - (contentRect?.width || 0);
    }
  } else {
    if (result < 0) result = 0;
    if (window.innerWidth < result + (contentRect?.width || 0)) {
      result = window.innerWidth - (contentRect?.width || 0);
    }
  }

  return result;
}

export function getYPosition(
  positionY: YPositionType,
  rect: DOMRect,
  contentRect: DOMRect | undefined,
  controlRect: DOMRect | undefined,
  isStaticPosition?: boolean,
  scrollY: number = window.scrollY
) {
  const isTopPositionY = positionY === "top";
  const isBottomPositionY = positionY === "bottom";
  const isBottomStartPositionY = positionY === "bottom-start";
  const isBottomEndPositionY = positionY === "bottom-end";
  const isMiddlePositionY = positionY === "middle";

  let result = isStaticPosition ? rect.top + scrollY : rect.top;

  if (isTopPositionY) {
    result -= Math.floor((contentRect?.height || 0) - 4);
  }
  if (isMiddlePositionY) {
    result -= Math.floor(contentRect?.height || 0) / 2 - Math.floor(controlRect?.height || 0) / 2;
  }
  if (isBottomPositionY) {
    result += Math.floor((controlRect?.height || 0) + 4);
  }
  if (isBottomStartPositionY) {
    result += Math.floor((controlRect?.height || 0) - (contentRect?.height || 0) - 4);
  }
  if (isBottomEndPositionY) {
    result += 0;
  }

  if (isStaticPosition) {
    if (result < scrollY) result = scrollY;
    if (window.innerHeight + scrollY < result + (contentRect?.height || 0)) {
      result = window.innerHeight + scrollY - (contentRect?.height || 0);
    }
  } else {
    if (result < 0) result = 0;
    if (window.innerHeight < result + (contentRect?.height || 0)) {
      result = window.innerHeight - (contentRect?.height || 0);
    }
  }

  return result;
}

export default memo(Popover);
