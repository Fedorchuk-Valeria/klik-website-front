"use client";

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import avatar from "@/src/assets/images/view/profile/avatar.png";

import PartnerAccordionItem from "@/src/components/Pages/PagesProfile/PartnerAccordionItem";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import PhoneInput from "@/src/components/ui/PhoneInput";
import Popover from "@/src/components/ui/Popover";
import TextInput from "@/src/components/ui/TextInput";

import { getPlural } from "@/src/helper/getPlural";
import { PAGES } from "@/src/utils/constant";

const ChildrenDetailsPage = () => {
  const [openPartnerIndex, setOpenPartnerIndex] = useState<number | null>(null);

  const partners = useMemo(
    () => [
      {
        title: "Детский мир",
        image: avatar as unknown as string,
        description: (
          <>
            Детский мир предоставялет скидку 30% ученикам и их родителям на подготовку к школе.
            Используйте промокод{" "}
            <span className="children-details-page__partners_item-accent">klik-super</span> в
            интернет-магазине.
          </>
        ),
      },
      {
        title: "Детский мир",
        image: avatar as unknown as string,
        description: (
          <>
            Детский мир предоставялет скидку 30% ученикам и их родителям на подготовку к школе.
            Используйте промокод{" "}
            <span className="children-details-page__partners_item-accent">klik-super</span> в
            интернет-магазине.
          </>
        ),
      },
    ],
    []
  );

  const general = [
    {
      icon: "clicoins",
      title: "Кликоины",
      value: 100,
      plural: ["кликоин", "кликоина", "кликоинов"],
      info: "Кликоины - это бонусные баллы, которые ученик получает за каждое оффлайн-занятие. Накопленные кликоины можно обменять на призы и подарки в специальном «Кликмаркете». Маркет проводится два раза в год - следите за объявлениями!",
    },
    {
      icon: "money",
      title: "Баланс",
      value: 100,
      plural: ["белорусский рубль", "белорусских рубля", "белорусских рублей"],
      info: "Это ваш предоплаченный баланс. Вы вносите деньги за несколько занятий вперёд, и система автоматически списывает стоимость одного урока после его проведения. Так вы можете не думать о ежемесячной оплате - просто пополняйте счёт, и занятия будут оплачиваться сами.",
    },
    {
      icon: "homework",
      title: "Занятия",
      value: 4,
      plural: ["оплаченное занятие", "оплаченных занятия", "оплаченных занятий"],
    },
  ];

  const programs = [
    {
      title: "Программа «Креаторы»",
      items: [
        {
          title: "Ссылка на чат группы в тг",
          value: "@Klik-tg-chat",
          link: "https://t.me/Klik-tg-chat",
        },
        {
          title: "Локация",
          value: "Арэна, г. Минск, Пр. Победителей 84, ТЦ Arena City, 2 этаж",
        },
        {
          title: "Менеджер-ссылка на аккаунт в Telegram",
          value: "@Klik-tg-manager",
          link: "https://t.me/Klik-tg-manager",
        },
        {
          title: "Абонемент (+скидка)",
          value: "220р/4 занятия, скидка 10%",
        },
        {
          title: "День и время занятия",
          value: "пн, 16:00",
        },
        {
          title: "Тема следующего занятия",
          value: "JavaScript: основы языка",
        },
      ],
    },
    {
      title: "Программа «Креаторы»",
      items: [
        {
          title: "Ссылка на чат группы в тг",
          value: "@Klik-tg-chat",
          link: "https://t.me/Klik-tg-chat",
        },
        {
          title: "Локация",
          value: "Арэна, г. Минск, Пр. Победителей 84, ТЦ Arena City, 2 этаж",
        },
        {
          title: "Менеджер-ссылка на аккаунт в Telegram",
          value: "@Klik-tg-manager",
          link: "https://t.me/Klik-tg-manager",
        },
        {
          title: "Абонемент (+скидка)",
          value: "220р/4 занятия, скидка 10%",
        },
        {
          title: "День и время занятия",
          value: "пн, 16:00",
        },
        {
          title: "Тема следующего занятия",
          value: "JavaScript: основы языка",
        },
      ],
    },
  ];

  const togglePartner = (index: number) => {
    setOpenPartnerIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="children-details-page">
      <div className="platform-layout__container">
        <div className="children-details-page__content">
          <Link href={PAGES.PROFILE} className="children-details-page__back">
            <Icon name="arrow" />

            <span>Вернуться к профилю родителя</span>
          </Link>

          <h1 className="children-details-page__title">Личный кабинет ученика</h1>

          <div className="children-details-page__user-info">
            <Image src={avatar} alt="avatar" className="children-details-page__user-info_avatar" />

            <div className="children-details-page__user-info_form">
              <TextInput
                variant="outline"
                label="ФИО"
                value="Иванов Иван Иванович"
                className="login-page__form-input"
                disabled={true}
              />

              <PhoneInput
                variant="outline"
                label="Телефон"
                value="+375441234567"
                className="login-page__form-input"
                disabled={true}
              />
            </div>
          </div>

          <Link
            className={classNames("page-profile__link", "children-details-page__link")}
            href={PAGES.PROFILE_PASSWORD}
          >
            Управление паролем ребенка
            <span>
              <Icon className="page-profile__link-icon" name="arrow" />
            </span>
          </Link>

          <div className="children-details-page__general">
            {general.map((item, generalIndex) => (
              <div key={item.icon} className="children-details-page__general_item">
                <div className="children-details-page__general_headline">
                  <div className="children-details-page__general_headline-tag">
                    <span>
                      <Icon name={item.icon} />
                    </span>
                    <span>{item.title}</span>
                  </div>

                  {item.info && (
                    <Popover
                      id={`item-popover-${generalIndex}`}
                      variant="hover"
                      positionX="right"
                      positionY="bottom-end"
                      content={item.info}
                      className="children-details-page__general_headline-info"
                      popoverClassName="children-details-page__general_headline-info-popover"
                    >
                      <Icon name="info-circle-outline" />
                    </Popover>
                  )}
                </div>

                <p className="children-details-page__general_value">{item.value}</p>
                <span className="children-details-page__general_text">
                  {getPlural(item.value, item.plural as [string, string, string])}
                </span>
              </div>
            ))}
          </div>

          <div className="children-details-page__partners">
            <div className="home-page__tag children-details-page__partners_tag">Партнеры</div>

            <div className="children-details-page__partners_headline">
              <p>Наши партнеры</p>
              <span>Партнёрские скидки для резидентов KLiK</span>
            </div>

            <div className="children-details-page__partners_wrapper">
              <div className="children-details-page__partners_list">
                {partners.map((item, index) => (
                  <PartnerAccordionItem
                    key={index}
                    item={item}
                    isOpen={openPartnerIndex === index}
                    onToggle={() => togglePartner(index)}
                  />
                ))}
              </div>

              <button className="children-details-page__partners_more">
                <Icon name="arrow" />

                <span>Показать еще</span>
              </button>
            </div>
          </div>

          <div className="children-details-page__formats">
            <div className="home-page__tag children-details-page__formats_tag">
              Форматы обучения
            </div>

            <p className="children-details-page__formats_text">
              Со всеми форматами обучения школы вы можете ознакомиться на нашем{" "}
              <Link href={PAGES.HOME}>сайте.</Link>
            </p>

            <div className="children-details-page__formats_wrapper">
              <div className="children-details-page__formats_item">
                <p className="children-details-page__formats_item-title">
                  Самостоятельное обучение
                </p>

                <p className="children-details-page__formats_item-text">
                  Перейдите к обучению на платформе
                </p>

                <Link href={PAGES.COURSES} className="children-details-page__formats_item-button">
                  <Button variant="main-green-dark" withArrow>
                    Перейти к курсам
                  </Button>
                </Link>
              </div>

              <ul className="children-details-page__formats_list">
                <li className="children-details-page__formats_list-item">
                  <div className="children-details-page__formats_item-status">
                    <Icon name="success-circle" />

                    <span>Активный</span>
                  </div>

                  <div className="children-details-page__formats_item-content">
                    <div className="children-details-page__formats_item-content-text">
                      <p>Web-разработка: HTML, CSS, JavaScript</p>

                      <span>Срок доступа к курсу: 20.01.2026 - 20.05.2026</span>
                    </div>

                    <Link
                      className="children-details-page__formats_item-content-button"
                      href={PAGES.LESSON.replace(":id", "1").replace(":lessonId", "1")}
                    >
                      <Button variant="main-green-dark">
                        <Icon name="arrow-long" />
                      </Button>
                    </Link>
                  </div>
                </li>

                <li
                  className={classNames(
                    "children-details-page__formats_list-item",
                    "children-details-page__formats_list-item--disabled"
                  )}
                >
                  <div className="children-details-page__formats_item-status">
                    <Icon name="success-circle" />

                    <span>Активный</span>
                  </div>

                  <div className="children-details-page__formats_item-content">
                    <div className="children-details-page__formats_item-content-text">
                      <p>Web-разработка: HTML, CSS, JavaScript</p>

                      <span>Срок доступа к курсу: 20.01.2026 - 20.05.2026</span>
                    </div>

                    <Link
                      className="children-details-page__formats_item-content-button"
                      href={PAGES.LESSON.replace(":id", "1").replace(":lessonId", "1")}
                    >
                      <Button variant="main-green-dark">
                        <Icon name="arrow-long" />
                      </Button>
                    </Link>
                  </div>
                </li>

                <button className="children-details-page__formats_item-more">
                  <Icon name="arrow" />

                  <span>Показать еще</span>
                </button>
              </ul>
            </div>
          </div>

          <div className="children-details-page__offline">
            <div className="children-details-page__offline_headline">
              <p className="children-details-page__offline_headline-title">
                Офлайн-занятия в группе
              </p>

              <div className="children-details-page__offline_headline-actions">
                <Button variant="outline-orange">История платежей</Button>
                <Button variant="main-green-dark" withArrow>
                  Оплатить обучение
                </Button>
              </div>
            </div>

            <div className="children-details-page__offline_list">
              {programs.map((item, index) => (
                <div key={index} className="children-details-page__offline_list-item">
                  <p className="children-details-page__offline_list-item-title">{item.title}</p>

                  <ul className="children-details-page__offline_list-item-info">
                    {item.items.map((info, infoIndex) => (
                      <li
                        key={`${index}-${infoIndex}`}
                        className="children-details-page__offline_list-item-info-item"
                      >
                        <span>{info.title}</span>
                        {!!info.link ? (
                          <a href={info.value} target="_blank" rel="noopener noreferrer">
                            <p>{info.value}</p>
                          </a>
                        ) : (
                          <p>{info.value}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildrenDetailsPage;
