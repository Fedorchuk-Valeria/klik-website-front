import {useRef, useState} from 'react';
import {PartnerAccordion} from "@/src/components/ui/PartnerAccordion";
import avatar from "@/src/assets/images/view/profile/avatar.png";
import Icon from "@/src/components/ui/Icon/Icon";

const INITIAL_COUNT = 6;

export const Partners = () => {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const partners = [...Array(12)];

  const visiblePartners = expanded
    ? partners
    : partners.slice(0, INITIAL_COUNT);

  const handleToggle = () => {
    const willCollapse = expanded;

    setExpanded(!expanded);

    if (willCollapse) {
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  };

  return (
    <div className="page-profile__partners" ref={sectionRef}>
      <div className="page-profile__tag">Партнёры</div>

      <div className="page-profile__partners-header">
        <div className="page-profile__partners-title">
          Наши партнёры
        </div>
        <div className="page-profile__partners-text">
          Партнёрские скидки для резидентов KLiK
        </div>
      </div>

      <div className="page-profile__partners-wrapper">
        <div className="page-profile__partners-list">
          {visiblePartners.map((item, i) => (
            <div
              key={i}
              className="page-profile__partner-item"
            >
              <PartnerAccordion
                item={{
                  title: 'Детский мир',
                  description:
                    'Детский мир предоставляет скидку 30% ученикам и их родителям на подготовку к школе.',
                  image: avatar,
                }}
              />
            </div>
          ))}
        </div>

        {partners.length > INITIAL_COUNT && (
          <div className="page-profile__partners-footer">
            <button
              className={`page-profile__partners-more ${
                expanded ? 'is-open' : ''
              }`}
              onClick={handleToggle}
            >
              <Icon
                className="page-profile__partners-ico"
                name="arrow"
              />

              <span>
                {expanded
                  ? 'Скрыть'
                  : 'Показать еще'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
