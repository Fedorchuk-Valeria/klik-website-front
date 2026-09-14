import { FC, useRef, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import { PartnerAccordion } from "@/src/components/ui/PartnerAccordion";

import { Partner } from "@/src/store/slices/profile";

const INITIAL_COUNT = 6;

type PropTypes = {
  data: Partner[] | null;
};

export const Partners: FC<PropTypes> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const visiblePartners = expanded ? data : data?.slice(0, INITIAL_COUNT);

  const handleToggle = () => {
    const willCollapse = expanded;

    setExpanded(!expanded);

    if (willCollapse) {
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  if (!visiblePartners) return null;

  return (
    <div className="page-profile__partners" ref={sectionRef}>
      <div className="page-profile__tag">Партнёры</div>

      <div className="page-profile__partners-header">
        <div className="page-profile__partners-title">Наши партнёры</div>
        <div className="page-profile__partners-text">Партнёрские скидки для резидентов KLiK</div>
      </div>

      <div className="page-profile__partners-wrapper">
        <div className="page-profile__partners-list">
          {visiblePartners?.map((item) => (
            <div key={item.id} className="page-profile__partner-item">
              <PartnerAccordion
                item={{
                  title: item.name,
                  description: item.description,
                  image: item.logo,
                }}
              />
            </div>
          ))}
        </div>

        {(data?.length || 0) > INITIAL_COUNT && (
          <div className="page-profile__partners-footer">
            <button
              className={`page-profile__partners-more ${expanded ? "is-open" : ""}`}
              onClick={handleToggle}
            >
              <Icon className="page-profile__partners-ico" name="arrow" />

              <span>{expanded ? "Скрыть" : "Показать еще"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
