"use client";

import classNames from "classnames";
import {
  FC,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export const TEXT_BORDER_RADIUS_WIDTHS = [1920, 1440, 1024, 800, 500] as const;
export type TextBorderCornerRadiusByWidth = Partial<
  Record<(typeof TEXT_BORDER_RADIUS_WIDTHS)[number], number>
>;

type PropTypes = {
  text: string;
  children?: ReactNode;
  cornerRadius?: number;
  cornerRadiusByWidth?: TextBorderCornerRadiusByWidth;
  pathOffset?: number;
  textColor?: string;
  className?: string;
};

const TextBorder: FC<PropTypes> = ({
  text,
  children,
  className,
  pathOffset = 10,
  cornerRadius = 12,
  cornerRadiusByWidth,
  textColor = "#FFBEE4",
}) => {
  const uid = useId().replace(/:/g, "");
  const pathId = `text-border-path-${uid}`;

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [resolvedCornerRadius, setResolvedCornerRadius] = useState(cornerRadius);

  useLayoutEffect(() => {
    function update() {
      const cardEl = cardRef.current;
      const contentEl = contentRef.current;
      const svgEl = svgRef.current;
      if (!cardEl || !contentEl || !svgEl) return;

      const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
      const effectiveRadius = resolveCornerRadiusForViewport(
        viewportWidth,
        cornerRadius,
        cornerRadiusByWidth
      );
      setResolvedCornerRadius((prev) => (prev === effectiveRadius ? prev : effectiveRadius));

      const pathEl = svgEl.querySelector<SVGPathElement>(`#${pathId}`);
      const textPathEl = svgEl.querySelector<SVGTextPathElement>(`#${pathId}-label`);
      if (!pathEl || !textPathEl) return;

      const ww = cardEl.clientWidth;
      const wh = cardEl.clientHeight;
      if (ww < 1 || wh < 1) return;

      svgEl.setAttribute("viewBox", `0 0 ${ww} ${wh}`);

      const cardRect = cardEl.getBoundingClientRect();
      const contentRect = contentEl.getBoundingClientRect();

      const L = contentRect.left - cardRect.left;
      const T = contentRect.top - cardRect.top;
      const W = contentRect.width;
      const H = contentRect.height;
      if (W < 1 || H < 1) return;

      const L0 = L - pathOffset;
      const T0 = T - pathOffset;
      const W0 = W + 2 * pathOffset;
      const H0 = H + 2 * pathOffset;

      let R = Math.min(effectiveRadius + pathOffset, W0 / 2, H0 / 2);
      if (R < 0) R = 0;

      const d = `M ${L0 + R},${T0} H ${L0 + W0 - R} A ${R},${R} 0 0 1 ${L0 + W0},${T0 + R} V ${T0 + H0 - R} A ${R},${R} 0 0 1 ${L0 + W0 - R},${T0 + H0} H ${L0 + R} A ${R},${R} 0 0 1 ${L0},${T0 + H0 - R} V ${T0 + R} A ${R},${R} 0 0 1 ${L0 + R},${T0} Z`;
      pathEl.setAttribute("d", d);

      if (!text) {
        textPathEl.textContent = "";
        return;
      }

      textPathEl.textContent = text;
      const phraseWidth = textPathEl.getComputedTextLength();
      if (phraseWidth <= 0) return;

      const perimeter = pathEl.getTotalLength();
      const repeats = Math.ceil(perimeter / phraseWidth) + 1;
      textPathEl.textContent = text.repeat(repeats);
    }

    update();

    const observer = new ResizeObserver(() => update());
    const contentEl = contentRef.current;
    if (contentEl) observer.observe(contentEl);

    const onResize = () => update();
    if (cornerRadiusByWidth && Object.keys(cornerRadiusByWidth).length > 0) {
      window.addEventListener("resize", onResize);
    }

    return () => {
      observer.disconnect();
      if (cornerRadiusByWidth && Object.keys(cornerRadiusByWidth).length > 0) {
        window.removeEventListener("resize", onResize);
      }
    };
  }, [text, pathId, cornerRadius, cornerRadiusByWidth, pathOffset]);

  return (
    <div className={classNames("text-border--wrapper", className)}>
      <div ref={cardRef} className="card">
        <svg
          ref={svgRef}
          className="text-border--svg"
          width="100%"
          height="100%"
          viewBox="0 0 1 1"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <path id={pathId} fill="none" />
          </defs>
          <text fontSize="13" fill={textColor} fontWeight="500">
            <textPath href={`#${pathId}`} id={`${pathId}-label`}></textPath>
          </text>
        </svg>

        <div
          ref={contentRef}
          className="card-content"
          style={
            {
              "--text-border-corner-radius": `${resolvedCornerRadius}px`,
            } as CSSProperties
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};

function resolveCornerRadiusForViewport(
  viewportWidth: number,
  fallback: number,
  byWidth?: TextBorderCornerRadiusByWidth
): number {
  if (!byWidth) return fallback;

  const keys = TEXT_BORDER_RADIUS_WIDTHS;
  let key: (typeof keys)[number];
  if (viewportWidth <= 500) key = 500;
  else if (viewportWidth <= 800) key = 800;
  else if (viewportWidth <= 1024) key = 1024;
  else if (viewportWidth <= 1440) key = 1440;
  else key = 1920;

  const direct = byWidth[key];
  if (direct != null) return direct;

  const orderAsc = [...keys].sort((a, b) => a - b);
  const idx = orderAsc.indexOf(key);
  for (let i = idx; i < orderAsc.length; i++) {
    const v = byWidth[orderAsc[i]];
    if (v != null) return v;
  }
  for (let i = idx - 1; i >= 0; i--) {
    const v = byWidth[orderAsc[i]];
    if (v != null) return v;
  }
  return fallback;
}

export default TextBorder;
