"use client";

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import image from "@/src/assets/images/view/courses/boy.png";

import { Meta } from "@/src/entities/common";
import { Course } from "@/src/lib/getCourses";
import {
  COURSES_PAGE_SIZE,
  PAGE_ANCHORS,
  PAGES,
  QUERY_PARAMS,
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
} from "@/src/utils/constant";
import { CookieHelper, QueryHelper } from "@/src/utils/helpers";

import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { clearCourses, getCoursesRequest, initCoursesFromSSR } from "@/src/store/slices/corses";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import Loader from "@/src/components/ui/Loader/Loader";
import Select from "@/src/components/ui/Select";

import { getPlural } from "@/src/helper/getPlural";
import { MAX_AGE } from "@/src/store/sagas/auth.saga";

type Props = {
  initialCourses?: Course[];
  initialMeta?: Meta;
  initialErrors?: Record<string, string> | null;
  initialIsLoggedIn?: boolean;
};

const buildCoursesQuery = (page: number, scope: string, categories: string[]): string =>
  QueryHelper.getQueryString({
    [QUERY_PARAMS.PAGE]: page,
    [QUERY_PARAMS.PAGE_SIZE]: COURSES_PAGE_SIZE,
    [QUERY_PARAMS.SCOPE]: scope,
    [QUERY_PARAMS.CATEGORIES]: categories.join(","),
  });

const CATEGORY_FILTER_DEBOUNCE_MS = 1000;

/** Empty and full category lists are equivalent for the API (no filter). */
const toApiCategories = (categoryIds: string[], allCategoryIds: string[]): string[] => {
  if (
    categoryIds.length === 0 ||
    (allCategoryIds.length > 0 && categoryIds.length === allCategoryIds.length)
  ) {
    return [];
  }

  return categoryIds;
};

const PagesCourses = ({
  initialCourses = [],
  initialMeta = {
    page: 1,
    page_size: COURSES_PAGE_SIZE,
    total_count: 0,
    total_pages: 0,
  },
  initialErrors = null,
  initialIsLoggedIn = false,
}: Props) => {
  const dispatch = useAppDispatch();
  const { data, meta, isLoading } = useAppSelector((state: RootStore) => state.courses);
  const { isLoggedIn } = useAppSelector((state: RootStore) => state.auth);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<{ id: string; name: string }>({
    id: "all",
    name: "Все курсы",
  });
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [hasRequested, setHasRequested] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(isLoading);
  const prevFiltersKeyRef = useRef<string | null>(null);
  const categoryDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCategoryDebounce = useCallback(() => {
    if (categoryDebounceTimerRef.current) {
      clearTimeout(categoryDebounceTimerRef.current);
      categoryDebounceTimerRef.current = null;
    }
  }, []);

  const allCategories = useMemo(() => {
    const seenCategoryIds = new Set<number>();

    return (
      (!!data?.length ? data : initialCourses)?.flatMap((item) => item.categories) ?? []
    ).filter((category) => {
      if (seenCategoryIds.has(category.id)) return false;

      seenCategoryIds.add(category.id);
      return true;
    });
  }, [data, initialCourses]);

  const activeMeta = hasRequested ? meta : initialMeta;

  const courses = useMemo(() => {
    return hasRequested ? data : initialCourses;
  }, [data, hasRequested, initialCourses]);

  const hasMore = activeMeta.page < activeMeta.total_pages;

  const showMyCoursesFilter = isHydrated ? isLoggedIn : initialIsLoggedIn;

  const options = useMemo(
    () => [
      { id: "all", name: "Все курсы" },
      ...(showMyCoursesFilter ? [{ id: "my", name: "Мои курсы" }] : []),
    ],
    [showMyCoursesFilter]
  );

  const categoryOptions = useMemo(
    () => allCategories.map((item) => ({ id: item.slug, name: item.name })),
    [allCategories]
  );

  const allCategoryIds = useMemo(() => categoryOptions.map((item) => item.id), [categoryOptions]);

  const apiCategories = useMemo(
    () => toApiCategories(appliedCategories, allCategoryIds),
    [appliedCategories, allCategoryIds]
  );

  const filtersKey = useMemo(
    () => `${selectedFilter.id}:${apiCategories.join(",")}`,
    [selectedFilter.id, apiCategories]
  );

  const selectedCategoryOptions = useMemo(
    () => categoryOptions.filter((item) => selectedCategory.includes(item.id)),
    [categoryOptions, selectedCategory]
  );

  const fetchCourses = useCallback(
    (page: number, append = false) => {
      const query = buildCoursesQuery(page, selectedFilter.id, apiCategories);

      dispatch(
        getCoursesRequest({
          query,
          append,
        })
      );
    },
    [dispatch, apiCategories, selectedFilter.id]
  );

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    const nextPage = activeMeta.page + 1;

    if (!hasRequested) {
      dispatch(initCoursesFromSSR({ data: initialCourses, meta: initialMeta }));
      setHasRequested(true);
    }

    fetchCourses(nextPage, true);
  }, [
    activeMeta.page,
    fetchCourses,
    hasMore,
    hasRequested,
    initialCourses,
    initialMeta,
    isLoading,
    dispatch,
  ]);

  const handleSelectFilter = (option: { id: string; name: string }) => () => {
    clearCategoryDebounce();
    setSelectedFilter(option);
    setSelectedCategory([]);
    setAppliedCategories([]);
  };

  const handleSelectCategories = (nextOptions: { id: string; name: string }[]) => {
    const categoryIds = nextOptions.map((item) => item.id);
    const nextApiCategories = toApiCategories(categoryIds, allCategoryIds);
    const isSameApiCategories =
      nextApiCategories.length === apiCategories.length &&
      nextApiCategories.every((id) => apiCategories.includes(id));

    setSelectedCategory(categoryIds);
    clearCategoryDebounce();

    // [] and "all categories" map to the same API request — update UI only, skip fetch.
    if (isSameApiCategories) {
      return;
    }

    categoryDebounceTimerRef.current = setTimeout(() => {
      setAppliedCategories(nextApiCategories);
    }, CATEGORY_FILTER_DEBOUNCE_MS);
  };

  // Clear the category filter debounce timer on unmount.
  useEffect(() => {
    return () => {
      clearCategoryDebounce();
    };
  }, [clearCategoryDebounce]);

  // Mark the client as hydrated after the first paint.
  useEffect(() => {
    queueMicrotask(() => {
      setIsHydrated(true);
    });
  }, []);

  // Persist admin auth tokens from the URL hash and reload without the hash.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);

      const params = new URLSearchParams(hash);

      const access = params.get("access");
      const refresh = params.get("refresh");
      const role = params.get("role");
      const source = params.get("source");

      if (!!access && !!refresh && role === "admin" && source === "admin") {
        CookieHelper.setCookie(TOKEN_KEY, access, {
          path: "/",
          expires: new Date(Date.now() + MAX_AGE),
        });

        CookieHelper.setCookie(REFRESH_TOKEN_KEY, refresh, {
          path: "/",
          expires: new Date(Date.now() + MAX_AGE),
        });

        window.location.replace(`${window.location.pathname}${window.location.search}`);
      }
    }
  }, []);

  // Keep a ref of isLoading for the IntersectionObserver callback.
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  // Log SSR/initial errors to the console.
  useEffect(() => {
    if (initialErrors) {
      console.error(initialErrors);
    }
  }, [initialErrors]);

  // Refetch page 1 when filters change; skip the default SSR state on first run.
  useEffect(() => {
    if (prevFiltersKeyRef.current === filtersKey) {
      return;
    }

    const previousKey = prevFiltersKeyRef.current;
    prevFiltersKeyRef.current = filtersKey;

    if (previousKey === null && apiCategories.length === 0 && selectedFilter.id === "all") {
      return;
    }

    fetchCourses(1);

    queueMicrotask(() => {
      setHasRequested(true);
    });
  }, [filtersKey, fetchCourses, apiCategories.length, selectedFilter.id]);

  // Hydrate scope/category filters from the URL search params.
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search) {
      const query = QueryHelper.getFromQueryString(window.location.search);

      if (query[QUERY_PARAMS.SCOPE]) {
        queueMicrotask(() => {
          setSelectedFilter(
            options.find((item) => item.id === query[QUERY_PARAMS.SCOPE]) || {
              id: "all",
              name: "Все курсы",
            }
          );
        });
      }

      if (query[QUERY_PARAMS.CATEGORIES]) {
        queueMicrotask(() => {
          const categoriesFromQuery = query[QUERY_PARAMS.CATEGORIES].split(",").filter(Boolean);
          const nextApiCategories = toApiCategories(
            categoriesFromQuery,
            categoryOptions.map((item) => item.id)
          );

          setSelectedCategory(categoriesFromQuery);
          setAppliedCategories(nextApiCategories);
        });
      }
    }
  }, [options, categoryOptions]);

  // Infinite scroll: load the next page when the sentinel enters the viewport.
  useEffect(() => {
    const sentinel = loadMoreRef.current;

    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingRef.current) {
          loadMore();
        }
      },
      { rootMargin: "400px", threshold: 0 }
    );

    observer.observe(sentinel);

    const queuedEntries = observer.takeRecords();
    if (queuedEntries.some((entry) => entry.isIntersecting) && !isLoadingRef.current) {
      loadMore();
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore, courses?.length]);

  return (
    <div className="page-courses">
      <div className="header__container">
        <div className="page-courses__header">
          <div className="courses__container">
            <div className="page-courses__header-content">
              <div className="page-courses__header-content-left">
                <h1 className="page-courses__header-title">
                  Самостоятельное обучение на платформе
                  <br />с ИИ помощником
                </h1>

                <p className="page-courses__header-text">
                  {`Онлайн-платформа, где ребёнок развивается в своём темпе с ИИ-помощником, а родитель спокоен за его занятость.`}
                </p>

                <ul className="page-courses__header-content-list">
                  {[
                    {
                      icon: "clock",
                      title: "24/7",
                      text: "с ИИ-помощником",
                    },
                    {
                      icon: "player",
                      title: "1 час",
                      text: "видеоурока с пользой",
                    },
                    {
                      icon: "document",
                      title: "6+",
                      text: "направлений",
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
                  <Button className="page-courses__header-button" variant="orange" withArrow>
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
          <div className="courses-headline__buttons">
            {options.map((item) => (
              <Button
                key={item.id}
                variant={selectedFilter.id === item.id ? "orange" : "outline-orange"}
                className={classNames("courses-headline__button", {
                  "courses-headline__button--non-active": selectedFilter.id !== item.id,
                })}
                onClick={handleSelectFilter(item)}
              >
                {item.name}
              </Button>
            ))}
          </div>

          <Select
            multiple
            isAbsolute
            color="green"
            icon="document"
            options={categoryOptions}
            allOptionName="Все категории"
            placeholder="Выбор категории"
            onChange={handleSelectCategories}
            selectedOptions={selectedCategoryOptions}
            className="courses-headline__select-categories"
          />
        </div>

        <div className="courses-list">
          {courses.map((item) => (
            <Link
              key={item.id}
              href={PAGES.COURSE.replace(":id", item.id.toString())}
              onClick={() => dispatch(clearCourses())}
              className={classNames("courses-list__item", {
                "courses-list__item--purchased": item.is_purchased,
              })}
            >
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
                  <Icon name="clock" /> {item.duration_months}{" "}
                  {getPlural(item.duration_months, ["месяц", "месяца", "месяцев"])}
                </span>

                <p className="courses-list__item-price">
                  {item?.price?.toLocaleString("ru-RU")}{" "}
                  <Icon name="ruble" className="courses-list__item-price-icon" />
                </p>

                <Button
                  className="courses-list__item-button"
                  variant={item.is_purchased ? "main-green-dark" : "outline-green-dark"}
                >
                  {item.is_purchased ? "Открыть" : "Подробнее"}
                </Button>
              </div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div ref={loadMoreRef} className="courses-list__load-more" aria-hidden="true" />
        )}

        {isLoading && courses?.length > 0 && (
          <div className="courses-list__load-more-loader">
            <Loader isLocal />
          </div>
        )}
      </div>
    </div>
  );
};

export default PagesCourses;
