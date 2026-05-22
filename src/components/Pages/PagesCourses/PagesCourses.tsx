"use client";

import classNames from "classnames";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Course } from "@/src/lib/getCourses";

import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

import Button from "@/src/components/ui/Button/Button";
import Select from "@/src/components/ui/Select";
import Icon from "../../ui/Icon/Icon";

type Props = {
  initialCourses?: Course[];
  initialErrors?: Record<string, string> | null;
};

const PagesCourses = ({ initialCourses = [], initialErrors = null }: Props) => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state: RootStore) => state.courses);
  const [selectedFilter, setSelectedFilter] = useState<{ id: string; name: string }>({
    id: "all",
    name: "Все курсы",
  });
  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);

  const allCategories = useMemo(() => {
    const seenCategoryIds = new Set<number>();

    return (
      (data.length > 0 ? data : initialCourses)?.flatMap((item) => item.categories) ?? []
    ).filter((category) => {
      if (seenCategoryIds.has(category.id)) return false;

      seenCategoryIds.add(category.id);
      return true;
    });
  }, [data, initialCourses]);

  const courses = useMemo(() => {
    return data.length > 0 ? data : initialCourses;
  }, [data, initialCourses]);

  const options = useMemo(
    () => [
      { id: "all", name: "Все курсы" },
      { id: "my", name: "Мои курсы" },
    ],
    []
  );

  const handleSelectCategory = (id: number) => () => {
    setSelectedCategory((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  console.log(initialCourses, initialErrors, allCategories, courses, selectedFilter);

  return (
    <div className="page-courses">
      <div className="header__container">
        <div className="page-courses__header">
          <h1>KLiK — дополнительное IT-образование для детей 6-16 лет</h1>
        </div>
      </div>

      <div className="courses__container">
        <p className="courses__title">Мои курсы</p>

        <p className="courses__text">Выберите курс для начала обучения</p>

        <div className="courses-headline">
          <Select
            icon="document"
            options={options}
            onChange={setSelectedFilter}
            selectedOption={selectedFilter}
            className="courses-headline__select"
          />

          <div className="courses-headline__filters">
            {allCategories.map((item) => (
              <Button
                key={item.id}
                variant="outline-green-dark"
                className={classNames("courses-headline__filter", {
                  "courses-headline__filter--active": selectedCategory.includes(item.id),
                })}
                onClick={handleSelectCategory(item.id)}
              >
                {item.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="courses-list">
          {courses.map((item) => (
            <div key={item.id} className="courses-list__item">
              <div className="courses-list__item-image">
                <Image src={item.image} alt={item.title} fill />

                {item.is_purchased && (
                  <span className="courses-list__item-purchased">
                    <Icon name="success-circle" /> Куплен
                  </span>
                )}

                {item.categories && (
                  <div className="courses-list__item-categories">
                    {item.categories.map((category) => (
                      <span key={category.id} className="courses-list__item-category">
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="courses-list__item-content">
                <p className="courses-list__item-title">{item.title}</p>
                <p className="courses-list__item-description">{item.description}</p>

                <span className="courses-list__item-duration">
                  <Icon name="clock" /> {item.duration_months} месяцев
                </span>

                <p className="courses-list__item-price">{item.price} P</p>

                <Button
                  className="courses-list__item-button"
                  variant={item.is_purchased ? "main-green-dark" : "outline-green-dark"}
                >
                  {item.is_purchased ? "Открыть" : "Подробнее"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PagesCourses;
