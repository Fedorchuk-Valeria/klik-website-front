import { useRef, useState } from 'react';
import Image, {StaticImageData} from 'next/image';
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

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`page-profile__partner ${open ? 'is-open' : ''}`}>
      <button
        className="page-profile__partner-header"
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="page-profile__partner-icon">
          <Image
            src={item.image}
            alt={item.title}
            className="page-profile__partner-image"
          />
        </div>

        <div className="page-profile__partner-title">
          {item.title}
        </div>

        <div className="page-profile__partner-more">
          <Icon
            className="page-profile__partner-ico"
            name="arrow"
          />
        </div>
      </button>

      <div
        className="page-profile__partner-content-wrapper"
        style={{
          maxHeight: open
            ? `${contentRef.current?.scrollHeight}px`
            : '0px',
        }}
      >
        <div
          ref={contentRef}
          className="page-profile__partner-content"
        >
          {item.description}
        </div>
      </div>
    </div>
  );
};
