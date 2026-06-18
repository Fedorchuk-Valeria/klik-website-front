"use client";

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import avatar from "@/src/assets/images/view/profile/avatar.png";

import PartnerAccordionItem from "@/src/components/Pages/PagesProfile/PartnerAccordionItem";
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
        </div>
      </div>
    </div>
  );
};

export default ChildrenDetailsPage;
