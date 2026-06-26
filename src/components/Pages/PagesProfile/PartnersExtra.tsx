import { useEffect, useRef, useState } from "react";

import PartnerAccordionItem from "@/src/components/Pages/PagesProfile/PartnerAccordionItem";

import { Partner } from "@/src/store/slices/profile";

type PartnersExtraProps = {
  partners: Partner[];
  isOpen: boolean;
  startIndex: number;
  openPartnerIndex: number | null;
  onTogglePartner: (index: number) => void;
  fallbackImage: string;
};

const PartnersExtra = ({
  partners,
  isOpen,
  startIndex,
  openPartnerIndex,
  onTogglePartner,
  fallbackImage,
}: PartnersExtraProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    setHeight(isOpen ? `${content.scrollHeight}px` : "0px");
  }, [isOpen, partners]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || !isOpen) return;

    const resizeObserver = new ResizeObserver(() => {
      setHeight(`${content.scrollHeight}px`);
    });

    resizeObserver.observe(content);

    return () => resizeObserver.disconnect();
  }, [isOpen, partners]);

  if (!partners.length) return null;

  return (
    <div className="children-details-page__partners_list-extra">
      <div className="children-details-page__partners_list-extra-content" style={{ height }}>
        <div ref={contentRef} className="children-details-page__partners_list-extra-items">
          {partners.map((item, index) => {
            const partnerIndex = startIndex + index;

            return (
              <PartnerAccordionItem
                key={item.id}
                item={{
                  image: item.logo || fallbackImage,
                  title: item.name || "",
                  description: item.description || "",
                }}
                isOpen={openPartnerIndex === partnerIndex}
                onToggle={() => onTogglePartner(partnerIndex)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PartnersExtra;
