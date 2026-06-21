"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import avatar from "@/src/assets/images/view/profile/avatar.png";
import EyeSvg from "@/src/assets/images/view/profile/eyes.svg";
import Line1Svg from "@/src/assets/images/view/profile/line1.svg";
import Line2Svg from "@/src/assets/images/view/profile/line2.svg";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { profileRequest } from "@/src/store/slices/auth";
import { PAGES, QUERY_PARAMS } from "@/src/utils/constant";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import Loader from "@/src/components/ui/Loader/Loader";
import { Partners } from "@/src/components/ui/Partners";
import PhoneInput from "@/src/components/ui/PhoneInput";
import TextInput from "@/src/components/ui/TextInput";

import { CitySettings } from "@/src/lib/getCitySettings";
import { phoneToLink } from "@/src/lib/utils/phoneLink";

import { ModalType } from "@/src/entities/common";
import { showModal } from "@/src/store/slices/modalSlice";
import { QueryHelper } from "@/src/utils/helpers";

type PropTypes = {
  settings: CitySettings;
};

const PagesProfile = ({ settings }: PropTypes) => {
  const dispatch = useAppDispatch();

  const { user_profile, isLoading } = useAppSelector((state) => state.auth);
  const role = user_profile?.role;
  const phone = settings?.phone ?? "";

  useEffect(() => {
    dispatch(profileRequest());
  }, [dispatch]);

  if (isLoading || !user_profile) {
    return <Loader />;
  }

  const handleCreateChildren = () => {
    dispatch(
      showModal({
        modalType: ModalType.CREATE_CHILDREN,
        modalProps: {},
      })
    );
  };

  const handleCreatePayment = () => {
    dispatch(
      showModal({
        modalType: ModalType.PAYMENT_CHILDREN,
        modalProps: {},
      })
    );
  };

  return (
    <div className="page-profile">
      <div className="platform-layout__container">
        <div className="page-profile__header">
          <h1>Личный кабинет</h1>
        </div>
        <div className="page-profile__content">
          <div className="page-profile__wrapper">
            <Image src={avatar} alt="avatar" className="page-profile__avatar" />

            <div className="page-profile__form">
              <TextInput
                variant="outline"
                label="ФИО"
                value={user_profile?.full_name}
                className="login-page__form-input"
                disabled={true}
              />
              <PhoneInput
                variant="outline"
                label="Телефон"
                value={user_profile?.phone}
                className="login-page__form-input"
                disabled={true}
              />
            </div>
          </div>
          <div className="page-profile__list">
            <Link
              className="page-profile__link"
              href={
                PAGES.COURSES +
                QueryHelper.getQueryString({
                  [QUERY_PARAMS.SCOPE]: "my",
                })
              }
            >
              Мои курсы
              <span>
                <Icon className="page-profile__link-icon" name="arrow" />
              </span>
            </Link>
            <Link className="page-profile__link" href={PAGES.PROFILE_PASSWORD}>
              Управление паролем
              <span>
                <Icon className="page-profile__link-icon" name="arrow" />
              </span>
            </Link>
          </div>
          <div className="page-profile__info">
            <Icon className="page-profile__info-icon" name="info-circle-outline" />
            По всем вопросам вы можете связаться с нами по номеру телефона{" "}
            <a href={phoneToLink(phone)}>{phone}</a>
          </div>
          <Partners />
          <div className="page-profile__childrens">
            <div className="page-profile__childrens-header">
              <div className="page-profile__childrens-left">
                <div className="page-profile__childrens-title">Профили детей</div>
                <div className="page-profile__childrens-text">Управление учебными профилями</div>
              </div>
              <div className="page-profile__childrens-actions">
                <Link href={PAGES.PROFILE_PAYMENTS}>
                  <Button variant="outline-green-dark">История платежей</Button>
                </Link>
                <Button variant="orange" onClick={handleCreateChildren}>
                  <Icon className="page-profile__children-icon" name="plus" />
                  Добавить ребёнка
                </Button>
              </div>
            </div>
            <div className="page-profile__childrens-list">
              {[...Array(3)].map((_, i) => (
                <div className="page-profile__children" key={i}>
                  <div className="page-profile__children-name">
                    Фамилия Имя Отчество Ребёнка 0{i + 1}
                  </div>
                  <div className="page-profile__children-tags">
                    <div className="page-profile__children-tag">
                      <Icon className="page-profile__children-icon" name="info-circle-outline" />
                      100 кликоинов
                    </div>
                    <div className="page-profile__children-tag">
                      <Icon className="page-profile__children-icon" name="info-circle-outline" />
                      100 бел. руб.
                    </div>
                    <div className="page-profile__children-tag">4 оплаченных занятия</div>
                  </div>
                  <div className="page-profile__children-block">
                    <div className="page-profile__children-title">
                      <Icon className="page-profile__children-icon" name="book" />
                      Самостоятельные курсы
                    </div>
                    <div className="page-profile__children-list">
                      <div className="page-profile__children-item">
                        <Icon className="page-profile__children-icon" name="disk" />
                        Доступные курсы:
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                  <div className="page-profile__children-wrapper">
                    <div className="page-profile__children-block">
                      <div className="page-profile__children-title">
                        <Icon className="page-profile__children-icon" name="people" />
                        Оффлайн занятия в группе
                      </div>
                      <div className="page-profile__children-list">
                        <div className="page-profile__children-item">
                          <Icon className="page-profile__children-icon" name="disk" />
                          Программа «Креаторы» :<span>@Klik-tg-chat</span>
                        </div>
                        <div className="page-profile__children-item">
                          <Icon className="page-profile__children-icon" name="disk" />
                          Программа «Лето» :<span>@Klik-tg-chat</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="main-light-outline"
                      className="page-profile__children-pay"
                      onClick={handleCreatePayment}
                    >
                      Оплатить обучение
                    </Button>
                  </div>
                  <Button
                    variant="main-light"
                    className="page-profile__children-more"
                    withArrow={true}
                  >
                    Подробнее
                  </Button>
                </div>
              ))}
            </div>
            <div className="page-profile__empty">
              <Line1Svg className="page-profile__empty-line1" />
              <Line2Svg className="page-profile__empty-line2" />
              <div className="page-profile__empty-body">
                <EyeSvg className="page-profile__empty-image" />
                <div className="page-profile__empty-title">Профили детей не созданы</div>
                <Button
                  variant="orange"
                  className="page-profile__empty-btn"
                  onClick={handleCreateChildren}
                >
                  <Icon className="page-profile__children-icon" name="plus" />
                  Создать профиль ребёнка
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagesProfile;
