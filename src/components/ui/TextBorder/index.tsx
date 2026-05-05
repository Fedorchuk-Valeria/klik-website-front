"use client";

import classNames from "classnames";
import { FC, useId, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

type PropTypes = {
  text: string;
  children?: ReactNode;
  cornerRadius?: number;
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
  textColor = "#FFBEE4",
}) => {
  const uid = useId().replace(/:/g, "");
  const pathId = `text-border-path-${uid}`;

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    function update() {
      const cardEl = cardRef.current;
      const contentEl = contentRef.current;
      const svgEl = svgRef.current;
      if (!cardEl || !contentEl || !svgEl) return;

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

      let R = Math.min(cornerRadius + pathOffset, W0 / 2, H0 / 2);
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

    return () => observer.disconnect();
  }, [text, pathId, cornerRadius, pathOffset]);

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
              "--text-border-corner-radius": `${cornerRadius}px`,
            } as CSSProperties
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default TextBorder;
