import Link from "next/link";
import { FC, useRef, useState } from "react";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { Course } from "@/src/entities/common";
import { PAGES, QUERY_PARAMS } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";

const INITIAL_COUNT = 5;

type PropTypes = {
  data: Course[] | null;
};

export const ActiveFormats: FC<PropTypes> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const visibleFormats = expanded ? data : data?.slice(0, INITIAL_COUNT);

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

  return (
    <div className="page-profile__formats" ref={sectionRef}>
      <div className="page-profile__tag">Форматы обучения</div>

      <div className="page-profile__formats-text">
        Со всеми форматами обучения школы вы можете ознакомиться на нашем{" "}
        <Link href={PAGES.HOME}>сайте</Link>.
      </div>

      <div className="page-profile__formats-wrapper">
        <div className="page-profile__formats-left">
          <div className="page-profile__formats-title">Самостоятельное обучение</div>
          <div className="page-profile__formats-left_text">Перейдите к обучению на платформе</div>
          <Link
            href={`${PAGES.COURSES}${QueryHelper.getQueryString({ [QUERY_PARAMS.SCOPE]: "my" })}`}
            className="page-profile__formats-left_link"
          >
            <Button
              variant="main-green-dark"
              className="page-profile__formats-btn"
              withArrow={true}
            >
              Перейти к курсам
            </Button>
          </Link>
        </div>
        <div className="page-profile__formats-right">
          <div className="page-profile__formats-list">
            {visibleFormats?.map((item) => (
              <div
                key={item.id}
                className={`page-profile__format ${!item.is_active ? "disabled" : ""}`}
              >
                {item.is_active && (
                  <div className="page-profile__format-tag">
                    <Icon name="success-circle" className="page-profile__format-tag_icon" />
                    Активный
                  </div>
                )}

                <div className="page-profile__format-wrapper">
                  <div className="page-profile__format-left">
                    <div className="page-profile__format-title">{item.title}</div>
                    <div className="page-profile__format-date">
                      Срок доступа к курсу: {item.date_range}
                    </div>
                  </div>

                  {item.is_active && (
                    <Link
                      className="page-profile__format-btn"
                      href={PAGES.COURSE.replace(":id", String(item.id))}
                    >
                      <Icon className="page-profile__format-btn_icon" name="arrow-long" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {(data?.length || 0) > INITIAL_COUNT && (
            <div className="page-profile__formats-footer">
              <button
                className={`page-profile__formats-more ${expanded ? "is-open" : ""}`}
                onClick={handleToggle}
              >
                <Icon className="page-profile__formats-ico" name="arrow" />

                <span>{expanded ? "Скрыть" : "Показать еще"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
