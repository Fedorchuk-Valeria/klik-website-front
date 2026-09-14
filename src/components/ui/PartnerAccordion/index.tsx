import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";

type Partner = {
  title: string;
  description: string;
  image: StaticImageData | string;
};

type Props = {
  item: Partner;
};

export const PartnerAccordion = ({ item }: Props) => {
  const [open, setOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState("0px");

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    if (open) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [open]);

  return (
    <div className={`page-profile__partner ${open ? "is-open" : ""}`}>
      <button className="page-profile__partner-header" onClick={() => setOpen((prev) => !prev)}>
        <div className="page-profile__partner-icon">
          <Image fill src={item.image} alt={item.title} className="page-profile__partner-image" />
        </div>

        <div className="page-profile__partner-title">{item.title}</div>

        <div className="page-profile__partner-more">
          <Icon className="page-profile__partner-ico" name="arrow" />
        </div>
      </button>

      <div className="page-profile__partner-content-wrapper" style={{ maxHeight }}>
        <div ref={contentRef} className="page-profile__partner-content">
          {item.description}
        </div>
      </div>
    </div>
  );
};
