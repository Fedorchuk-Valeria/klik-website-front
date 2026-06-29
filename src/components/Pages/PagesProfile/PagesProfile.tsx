"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import avatar from "@/src/assets/images/view/profile/avatar.png";
import EyeSvg from "@/src/assets/images/view/profile/eyes.svg";
import Line1Svg from "@/src/assets/images/view/profile/line1.svg";
import Line2Svg from "@/src/assets/images/view/profile/line2.svg";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import Loader from "@/src/components/ui/Loader/Loader";
import { Partners } from "@/src/components/ui/Partners";
import PhoneInput from "@/src/components/ui/PhoneInput";
import TextInput from "@/src/components/ui/TextInput";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { profileRequest } from "@/src/store/slices/auth";
import { showModal } from "@/src/store/slices/modalSlice";

import { ModalType } from "@/src/entities/common";
import { getPlural } from "@/src/helper/getPlural";
import { PAGES, QUERY_PARAMS } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";

import { CitySettings } from "@/src/lib/getCitySettings";
import { phoneToLink } from "@/src/lib/utils/phoneLink";
import {ActiveFormats, FormatsPreview} from "@/src/components/ui/ActiveFormats";
import {ActiveGroups, GroupPreview} from "@/src/components/ui/ActiveGroups";
import {ProfileBLock} from "@/src/components/ui/ProfileBlock";

type PropTypes = {
  settings: CitySettings;
};

const PagesProfile = ({ settings }: PropTypes) => {
  const dispatch = useAppDispatch();

  const { user_profile, isLoading } = useAppSelector((state) => state.auth);
  const role = user_profile?.role;
  const phone = settings?.phone ?? "";

  const isParent = role === 'parent';
  const title = isParent ? 'Личный кабинет' : 'Личный кабинет ученика';

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

  useEffect(() => {
    dispatch(profileRequest());
  }, [dispatch]);

  if (isLoading || !user_profile) {
    return <Loader />;
  }

  const formats: FormatsPreview[] = [
    {
      title: 'Web-разработка: HTML, CSS, JavaScript',
      date: '20.01.2026 - 20.05.2026',
      type: 'active',
      url: '#'
    },
    {
      title: 'Web-разработка: HTML, CSS, JavaScript',
      date: '20.01.2026 - 20.05.2026',
      type: 'disabled',
      url: '#'
    },
    {
      title: 'Web-разработка: HTML, CSS, JavaScript',
      date: '20.01.2026 - 20.05.2026',
      type: 'disabled',
      url: '#'
    },
    {
      title: 'Web-разработка: HTML, CSS, JavaScript',
      date: '20.01.2026 - 20.05.2026',
      type: 'disabled',
      url: '#'
    },
    {
      title: 'Web-разработка: HTML, CSS, JavaScript',
      date: '20.01.2026 - 20.05.2026',
      type: 'disabled',
      url: '#'
    },
    {
      title: 'Web-разработка: HTML, CSS, JavaScript',
      date: '20.01.2026 - 20.05.2026',
      type: 'disabled',
      url: '#'
    },
    {
      title: 'Web-разработка: HTML, CSS, JavaScript',
      date: '20.01.2026 - 20.05.2026',
      type: 'disabled',
      url: '#'
    },
    {
      title: 'Web-разработка: HTML, CSS, JavaScript',
      date: '20.01.2026 - 20.05.2026',
      type: 'disabled',
      url: '#'
    }
  ];

  const groups: GroupPreview[] = [
    {
      title: 'Программа «Креаторы»',
      location: 'Арэна, г. Минск, Пр. Победителей 84, ТЦ Arena City, 2 этаж',
      date: 'пн, 16:00',
      theme: 'JavaScript: основы языка'
    },
    {
      title: 'Программа «Креаторы»',
      location: 'Арэна, г. Минск, Пр. Победителей 84, ТЦ Arena City, 2 этаж',
      date: 'пн, 16:00',
      theme: 'JavaScript: основы языка'
    },
  ];

  const clickoins = {
    icon: "clicoins",
    title: "Кликоины",
    value: 0,
    plural: ["кликоин", "кликоина", "кликоинов"],
    info: "Кликоины - это бонусные баллы, которые ученик получает за каждое оффлайн-занятие. Накопленные кликоины можно обменять на призы и подарки в специальном «Кликмаркете». Маркет проводится два раза в год - следите за объявлениями!",
  };

  return (
    <div className="page-profile">
      <div className="platform-layout__container">
        <div className="page-profile__header">
          <h1>{title}</h1>
        </div>
        <div className="page-profile__content">
          <div className="page-profile__body">
            <div className="page-profile__wrapper">
              <Image src={avatar} alt="avatar" className="page-profile__avatar" />

              <div className="page-profile__form">
                <TextInput
                  variant="outline"
                  label="ФИО"
                  value={user_profile?.profile?.full_name}
                  className="login-page__form-input"
                  disabled={true}
                />
                {isParent && (<PhoneInput
                  variant="outline"
                  label="Телефон"
                  value={user_profile?.profile?.phone}
                  className="login-page__form-input"
                  disabled={true}
                />)}
              </div>
            </div>
            {!isParent && (<ProfileBLock item={clickoins} generalIndex={0} />)}
          </div>

          {isParent && (
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
          )}

          {isParent && (<div className="page-profile__info">
            <Icon className="page-profile__info-icon" name="info-circle-outline" />
            По всем вопросам вы можете связаться с нами по номеру телефона{" "}
            <a href={phoneToLink(phone)}>{phone}</a>
          </div>)}

          <Partners data={user_profile?.partners} />

          {!isParent && (
            <>
              <ActiveFormats data={formats} />
              <ActiveGroups data={groups} />
            </>
          )}

          {isParent && (
            <div className="page-profile__childrens">
              {!!user_profile?.children?.length && (
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
              )}

              {!!user_profile?.children?.length && (
                <div className="page-profile__childrens-list">
                  {user_profile?.children?.map((child, i) => (
                    <div className="page-profile__children" key={i}>
                      <div className="page-profile__children-name">{child?.full_name}</div>

                      <div className="page-profile__children-tags">
                        <div className="page-profile__children-tag">
                          <Icon className="page-profile__children-icon" name="info-circle-outline" />
                          {child?.metrics?.klikcoins || 0}{" "}
                          {getPlural(child?.metrics?.klikcoins || 0, [
                            "кликоин",
                            "кликоина",
                            "кликоинов",
                          ])}
                        </div>

                        <div className="page-profile__children-tag">
                          <Icon className="page-profile__children-icon" name="info-circle-outline" />
                          {child?.metrics?.balance} бел. руб.
                        </div>

                        <div className="page-profile__children-tag">
                          {child?.metrics?.paid_lessons_count || 0}{" "}
                          {getPlural(child?.metrics?.paid_lessons_count || 0, [
                            "оплаченное занятие",
                            "оплаченных занятия",
                            "оплаченных занятий",
                          ])}
                        </div>
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
                            <span>{child?.self_study?.available_courses_count || 0}</span>
                          </div>
                        </div>
                      </div>

                      {!!child?.offline_groups?.length && (
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
                      )}

                      <Link href={PAGES.PROFILE_CHILDREN_DETAILS.replace(":id", String(child?.id))}>
                        <Button
                          variant="main-light"
                          className="page-profile__children-more"
                          withArrow={true}
                        >
                          Подробнее
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {!user_profile?.children?.length && (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagesProfile;
