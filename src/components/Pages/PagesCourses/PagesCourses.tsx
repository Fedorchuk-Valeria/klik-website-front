"use client";

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import image from "@/src/assets/images/view/courses/girl.png";

import { Course } from "@/src/lib/getCourses";
import { PAGE_ANCHORS, PAGES, QUERY_PARAMS } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";

import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getCoursesRequest } from "@/src/store/slices/corses";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import MediaImage from "@/src/components/ui/MediaImage";
import Select from "@/src/components/ui/Select";

type Props = {
  initialCourses?: Course[];
  initialErrors?: Record<string, string> | null;
};

const PagesCourses = ({ initialCourses = [], initialErrors = null }: Props) => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state: RootStore) => state.courses);
  const { isLoggedIn } = useAppSelector((state: RootStore) => state.auth);
  const [selectedFilter, setSelectedFilter] = useState<{ id: string; name: string }>({
    id: "all",
    name: "Все курсы",
  });
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [hasRequested, setHasRequested] = useState<boolean>(false);

  const allCategories = useMemo(() => {
    const seenCategoryIds = new Set<number>();

    return (initialCourses?.flatMap((item) => item.categories) ?? []).filter((category) => {
      if (seenCategoryIds.has(category.id)) return false;

      seenCategoryIds.add(category.id);
      return true;
    });
  }, [initialCourses]);

  const courses = useMemo(() => {
    return data.length > 0 || hasRequested ? data : initialCourses;
  }, [data, hasRequested, initialCourses]);

  const options = useMemo(
    () => [
      { id: "all", name: "Все курсы" },
      ...(isLoggedIn ? [{ id: "my", name: "Мои курсы" }] : []),
    ],
    [isLoggedIn]
  );

  const categoryOptions = useMemo(
    () => allCategories.map((item) => ({ id: item.slug, name: item.name })),
    [allCategories]
  );

  const selectedCategoryOptions = useMemo(
    () => categoryOptions.filter((item) => selectedCategory.includes(item.id)),
    [categoryOptions, selectedCategory]
  );

  const handleSelectCategory = (slug: string) => () => {
    setSelectedCategory((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((item) => item !== slug);
      }

      return [...prev, slug];
    });
  };

  const handleSelectFilter = (option: { id: string; name: string }) => {
    setSelectedFilter(option);
    setSelectedCategory([]);
  };

  const handleSelectCategories = (options: { id: string; name: string }[]) => {
    setSelectedCategory(options.map((item) => item.id));
  };

  useEffect(() => {
    if (initialErrors) {
      console.error(initialErrors);
    }
  }, [initialErrors]);

  useEffect(() => {
    if (selectedCategory.length > 0 || selectedFilter.id !== "all" || hasRequested) {
      dispatch(
        getCoursesRequest(
          QueryHelper.getQueryString({
            [QUERY_PARAMS.SCOPE]: selectedFilter.id,
            [QUERY_PARAMS.CATEGORIES]: selectedCategory.join(","),
          })
        )
      );

      queueMicrotask(() => {
        setHasRequested(true);
      });
    }
  }, [selectedFilter, selectedCategory, dispatch]);

  return (
    <div className="page-courses">
      <div className="header__container">
        <div className="page-courses__header">
          <div className="courses__container">
            <div className="page-courses__header-content">
              <div className="page-courses__header-content-left">
                <h1 className="page-courses__header-title">
                  KLiK — дополнительное IT-образование для детей 6-16 лет
                </h1>

                <p className="page-courses__header-text">
                  {`Система, созданная белорусскими IT-специалистами,\nгде учат понимать, создавать и превращать идеи в проекты`}
                </p>

                <ul className="page-courses__header-content-list">
                  {[
                    {
                      icon: "book",
                      title: "62",
                      text: "обучающих блока",
                    },
                    {
                      icon: "people",
                      title: "12",
                      text: "человек в группе",
                    },
                    {
                      icon: "code",
                      title: "80%",
                      text: "практики",
                    },
                  ].map((item) => (
                    <li className="page-courses__header-content-item" key={item.icon}>
                      <span className="page-courses__header-icon">
                        <Icon name={item.icon} />
                      </span>

                      <div>
                        <p className="page-courses__header-content-item-title">{item.title}</p>
                        <span className="page-courses__header-content-item-text">{item.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <Link
                  className="page-courses__header-button-link"
                  href={`#${PAGE_ANCHORS.COURSES}`}
                >
                  <Button className="page-courses__header-button" variant="main-light" withArrow>
                    Записаться на курс
                  </Button>
                </Link>
              </div>

              <div className="page-courses__header-image">
                <Image src={image} alt="KLiK" fill />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="courses__container" id={PAGE_ANCHORS.COURSES}>
        <p className="courses__title">Мои курсы</p>

        <p className="courses__text">Выберите курс для начала обучения</p>

        <div className="courses-headline">
          <Select
            icon="document"
            options={options}
            onChange={handleSelectFilter}
            selectedOption={selectedFilter}
            className="courses-headline__select"
          />

          <div className="courses-headline__filters">
            {allCategories.map((item) => (
              <Button
                key={item.id}
                variant="outline-green-dark"
                className={classNames("courses-headline__filter", {
                  "courses-headline__filter--active": selectedCategory.includes(item.slug),
                })}
                onClick={handleSelectCategory(item.slug)}
              >
                {item.name}
              </Button>
            ))}

            <Select
              multiple
              color="green"
              icon="document"
              options={categoryOptions}
              allOptionName="Все направления"
              onChange={handleSelectCategories}
              selectedOptions={selectedCategoryOptions}
              className="courses-headline__select-categories"
            />
          </div>
        </div>

        <div className="courses-list">
          {courses.map((item) => (
            <div
              key={item.id}
              className={classNames("courses-list__item", {
                "courses-list__item--purchased": item.is_purchased,
              })}
            >
              <div className="courses-list__item-image">
                <MediaImage src={item.image} alt={item.title} fill />

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

                <p className="courses-list__item-price">
                  {item.price} <Icon name="ruble" className="courses-list__item-price-icon" />
                </p>

                <Link href={PAGES.COURSE.replace(":id", item.id.toString())}>
                  <Button
                    className="courses-list__item-button"
                    variant={item.is_purchased ? "main-green-dark" : "outline-green-dark"}
                  >
                    {item.is_purchased ? "Открыть" : "Подробнее"}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PagesCourses;
