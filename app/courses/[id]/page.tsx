import Image from "next/image";
import Link from "next/link";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import { PAGES } from "@/src/utils/constant";
import classNames from "classnames";

export const dynamic = "force-dynamic";

export default async function CoursePage() {
  // const { data, errors } = await getCourses();

  return (
    <div className="course-page">
      <Link href={PAGES.COURSES} className="course-page__back">
        <Icon name="arrow-left" /> К списку курсов
      </Link>

      <div className="course-page__content">
        <div className="course-page__content-about">
          <div className="course-page__content-about-image">
            <Image src={"https://placehold.net/default.png"} alt={"course"} fill />

            <div className="course-page__content-about-purchased">
              <Icon name="success-circle" />
              <p>Куплен</p>
            </div>

            <div className="course-page__content-about-categories">
              <span className="course-page__content-about-category">Программирование</span>
            </div>
          </div>

          <div className="course-page__content-about-info">
            <p className="course-page__content-about-info_title">Python для начинающих</p>
            <p className="course-page__content-about-info_description">
              Полный курс по основам программирования на Python. Изучите переменные, циклы, функции,
              ООП и создайте свои первые проекты.
            </p>
            <p className="course-page__content-about-info_price">
              <p>15 990</p>
              <Icon name="ruble" />
            </p>

            <Button
              className="course-page__content-about-info_button"
              variant="main-green-dark"
              withArrow
            >
              Оплатить курс
            </Button>

            <ul className="course-page__content-about-info_list">
              {[
                "Видео-уроки в HD качестве",
                "Материалы для скачивания",
                "Домашние задания",
                "Тесты для проверки знаний",
                "ИИ-помощник 24/7",
              ].map((item) => (
                <li key={item}>
                  <Icon name="success-circle" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="course-page__content-timing">
          {[
            {
              id: 1,
              title: "24",
              icon: "player",
              description: "урока",
            },
            {
              id: 2,
              icon: "clock",
              title: "3 месяца",
              description: "длительность",
            },
          ].map((item) => (
            <div key={item.id} className="course-page__content-timing_item">
              <span className="course-page__content-timing_item-icon">
                <Icon name={item.icon} />
              </span>

              <div className="course-page__content-timing_item-content">
                <p>{item.title}</p>
                <span>{item.description}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="course-page__content-tutorial">
          <div className="course-page__content-tutorial_progress">
            <div className="course-page__content-tutorial_progress-title">
              <p className="course-page__content-tutorial_progress-title-text">Прогресс курса</p>
              <p className="course-page__content-tutorial_progress-count">
                <span>1/</span>4
              </p>
            </div>

            <div className="course-page__content-tutorial_progress-bar">
              {[...new Array(4).fill(0)].map((_, index) => (
                <div
                  key={index}
                  className={classNames("course-page__content-tutorial_progress-bar-item", {
                    "course-page__content-tutorial_progress-bar-item--active": index === 0,
                  })}
                />
              ))}
            </div>
          </div>

          <div className="course-page__content-tutorial_content">
            <p className="course-page__content-tutorial_content-title">Содержание курса</p>
            <p className="course-page__content-tutorial_content-description">
              Оплатите курс для доступа к урокам
            </p>
          </div>

          <ul className="course-page__content-tutorial_content-list">
            {[
              {
                id: 1,
                title: "Урок 1",
                duration: "50 минут",
              },
            ].map((item, index) => (
              <li key={index}>
                <div>{item.id}</div>
                <div>
                  <p>{item.title}</p>
                  <p>
                    {<Icon name="clock" />} {item.duration}
                  </p>
                  <Link href={"#"}>
                    <button>
                      <Icon name="play" />
                      Перейти к уроку
                    </button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
