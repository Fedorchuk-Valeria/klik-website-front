"use client";

import { useState } from "react";

import Button from "@/src/components/ui/Button/Button";
import classNames from "classnames";

const PagesCourses = () => {

  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const filters = [
    {
      label: "Дизайн",
      value: "design",
    },
    {
      label: "Разработка игр",
      value: "game-development",
    },
    {
      label: "Python",
      value: "python",
    },
    {
      label: "Программирование",
      value: "programming",
    },
    {
      label: "Мобильные приложения",
      value: "mobile-applications",
    },
    {
      label: "Цифровой баланс",
      value: "digital-balance",
    },
  ];

  return (
    <div className="page-courses">
      <div className="header__container"><div className="page-courses__header"><h1>KLiK —
        дополнительное
        IT-образование
        для детей 6-16 лет</h1></div>
      </div>
      <h1 className="courses__title">Мои курсы</h1>

      <p className="courses__text">Выберите курс для начала обучения</p>

      <div className="courses-headline">
        <div className="courses-headline__select"></div>

        <div className="courses-headline__filters">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant="outline-green-dark"
              className={classNames("courses-headline__filter", {
                "courses-headline__filter--active": selectedFilter === filter.value,
              })}
              onClick={() => setSelectedFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="courses-list"></div>
    </div>
  );
};

export default PagesCourses;
