"use client";

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import avatar from "@/src/assets/images/view/profile/avatar.png";

import FormatsCourseItem from "@/src/components/Pages/PagesProfile/FormatsCourseItem";
import FormatsCoursesExtra from "@/src/components/Pages/PagesProfile/FormatsCoursesExtra";
import PartnerAccordionItem from "@/src/components/Pages/PagesProfile/PartnerAccordionItem";
import PartnersExtra from "@/src/components/Pages/PagesProfile/PartnersExtra";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import Loader from "@/src/components/ui/Loader/Loader";
import PhoneInput from "@/src/components/ui/PhoneInput";
import Popover from "@/src/components/ui/Popover";
import TextInput from "@/src/components/ui/TextInput";

import { getPlural } from "@/src/helper/getPlural";
import { PAGES, QUERY_PARAMS } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getCurrentChildRequest } from "@/src/store/slices/profile";

const ChildrenDetailsPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { currentChild, isLoading } = useAppSelector((store) => store.profile);
  const [openPartnerIndex, setOpenPartnerIndex] = useState<number | null>(null);
  const [isOpenCourses, setOpenCourses] = useState(false);
  const [isOpenPartners, setOpenPartners] = useState(false);

  const togglePartners = () => {
    setOpenPartners((prev) => !prev);
  };

  const toggleCourses = () => {
    setOpenCourses((prev) => !prev);
  };

  const general = useMemo(
    () => [
      {
        icon: "clicoins",
        title: "Кликоины",
        value: currentChild?.metrics?.klikcoins || 0,
        plural: ["кликоин", "кликоина", "кликоинов"],
        info: "Кликоины - это бонусные баллы, которые ученик получает за каждое оффлайн-занятие. Накопленные кликоины можно обменять на призы и подарки в специальном «Кликмаркете». Маркет проводится два раза в год - следите за объявлениями!",
      },
      {
        icon: "money",
        title: "Баланс",
        value: currentChild?.metrics?.balance || 0,
        plural: ["белорусский рубль", "белорусских рубля", "белорусских рублей"],
        info: "Это ваш предоплаченный баланс. Вы вносите деньги за несколько занятий вперёд, и система автоматически списывает стоимость одного урока после его проведения. Так вы можете не думать о ежемесячной оплате - просто пополняйте счёт, и занятия будут оплачиваться сами.",
      },
      {
        icon: "homework",
        title: "Занятия",
        value: currentChild?.metrics?.paid_lessons_count || 0,
        plural: ["оплаченное занятие", "оплаченных занятия", "оплаченных занятий"],
      },
    ],
    [currentChild?.metrics]
  );

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

  const courses = useMemo(
    () => currentChild?.self_study?.courses ?? [],
    [currentChild?.self_study?.courses]
  );
  const initialCourses = courses.slice(0, 3);
  const extraCourses = courses.slice(3);

  const initialPartners = currentChild?.partners?.slice(0, 6) ?? [];
  const extraPartners = currentChild?.partners?.slice(6) ?? [];

  const togglePartner = (index: number) => {
    setOpenPartnerIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (id) {
      dispatch(getCurrentChildRequest(Number(id)));
    }
  }, [dispatch, id]);

  if (isLoading || !currentChild) {
    return <Loader />;
  }

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
                value={currentChild?.profile?.full_name}
                className="login-page__form-input"
                disabled={true}
              />

              <PhoneInput
                variant="outline"
                label="Телефон"
                value={currentChild?.profile?.phone}
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

                <p className="children-details-page__general_value">{item.value || 0}</p>
                <span className="children-details-page__general_text">
                  {getPlural(Number(item.value || 0), item.plural as [string, string, string])}
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

            {/* in future add "accent" class for some elements in description */}
            <div
              className={classNames("children-details-page__partners_wrapper", {
                "is-open": isOpenPartners,
              })}
            >
              <div className="children-details-page__partners_list">
                {initialPartners.map((item, index) => (
                  <PartnerAccordionItem
                    key={item.id}
                    item={{
                      image: item.logo || (avatar as unknown as string),
                      title: item.name || "",
                      description: item.description || "",
                    }}
                    isOpen={openPartnerIndex === index}
                    onToggle={() => togglePartner(index)}
                  />
                ))}

                {extraPartners.length > 0 && (
                  <PartnersExtra
                    partners={extraPartners}
                    isOpen={isOpenPartners}
                    startIndex={6}
                    openPartnerIndex={openPartnerIndex}
                    onTogglePartner={togglePartner}
                    fallbackImage={avatar as unknown as string}
                  />
                )}
              </div>

              {currentChild?.partners?.length > 6 && (
                <button
                  type="button"
                  className="children-details-page__partners_more"
                  onClick={togglePartners}
                >
                  <Icon name="arrow" />

                  <span>{isOpenPartners ? "Скрыть" : "Показать еще"}</span>
                </button>
              )}
            </div>
          </div>

          {currentChild?.self_study?.courses?.length > 0 && (
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

                  <Link
                    href={`${PAGES.COURSES}${QueryHelper.getQueryString({ [QUERY_PARAMS.SCOPE]: "my" })}`}
                    className="children-details-page__formats_item-button"
                  >
                    <Button variant="main-green-dark" withArrow>
                      Перейти к курсам
                    </Button>
                  </Link>
                </div>

                <ul
                  className={classNames("children-details-page__formats_list", {
                    "is-open": isOpenCourses,
                  })}
                >
                  {initialCourses.map((item) => (
                    <FormatsCourseItem key={item.id} item={item} />
                  ))}

                  {extraCourses.length > 0 && (
                    <FormatsCoursesExtra courses={extraCourses} isOpen={isOpenCourses} />
                  )}

                  {courses.length > 3 && (
                    <button
                      type="button"
                      className="children-details-page__formats_item-more"
                      onClick={toggleCourses}
                    >
                      <Icon name="arrow" />

                      <span>{isOpenCourses ? "Скрыть" : "Показать еще"}</span>
                    </button>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* TODO add groups */}
          {currentChild?.offline_groups?.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildrenDetailsPage;
