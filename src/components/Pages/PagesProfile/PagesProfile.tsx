"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import avatar from "@/src/assets/images/view/profile/avatar.png";
import EyeSvg from "@/src/assets/images/view/profile/eyes.svg";
import Line1Svg from "@/src/assets/images/view/profile/line1.svg";
import Line2Svg from "@/src/assets/images/view/profile/line2.svg";

import { ActiveFormats } from "@/src/components/ui/ActiveFormats";
import { ActiveGroups } from "@/src/components/ui/ActiveGroups";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import Loader from "@/src/components/ui/Loader/Loader";
import { Partners } from "@/src/components/ui/Partners";
import PhoneInput from "@/src/components/ui/PhoneInput";
import Popover from "@/src/components/ui/Popover";
import { ProfileBLock } from "@/src/components/ui/ProfileBlock";
import TextInput from "@/src/components/ui/TextInput";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { profileRequest } from "@/src/store/slices/auth";
import { showModal } from "@/src/store/slices/modalSlice";

import { ModalType } from "@/src/entities/common";
import { getPlural } from "@/src/helper/getPlural";
import { CitySettings } from "@/src/lib/getCitySettings";
import { phoneToLink } from "@/src/lib/utils/phoneLink";
import { METRICS, PAGES, QUERY_PARAMS } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";

type PropTypes = {
  settings: CitySettings;
};

const PagesProfile = ({ settings }: PropTypes) => {
  const dispatch = useAppDispatch();
  const [isMounted, setIsMounted] = useState(false);

  const { user_profile, isLoading } = useAppSelector((state) => state.auth);
  const role = user_profile?.role;
  const phone = settings?.phone ?? "";

  console.log('user_profile=', user_profile);

  const isParent = role === "parent";
  const isAdmin = role === 'admin';
  const title = isParent || isAdmin ? "Личный кабинет" : "Личный кабинет ученика";

  const clickoins = {
    ...METRICS.klikcoins,
    value: user_profile?.metrics?.klikcoins ?? 0,
  };

  const handleCreateChildren = () => {
    dispatch(
      showModal({
        modalType: ModalType.CREATE_CHILDREN,
        modalProps: {},
      })
    );
  };

  const handleCreatePayment = (childId: number) => {
    dispatch(
      showModal({
        modalType: ModalType.PAYMENT_CHILDREN,
        modalProps: {
          childId: childId,
        },
      })
    );
  };

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    dispatch(profileRequest());
  }, [dispatch]);

  useEffect(() => {
    const payment = user_profile?.offline_training_payment_notification;

    if (!payment || !payment.show) {
      return;
    }

    dispatch(
      showModal({
        modalType: ModalType.PAYMENT_STATUS,
        modalProps: {
          payment: payment,
          settings,
        },
      })
    );
  }, [dispatch, settings, user_profile?.offline_training_payment_notification]);

  if (!isMounted || isLoading || !user_profile) {
    return <Loader />;
  }

  return (
    <div className={`page-profile ${isParent ? 'parent' : 'child'}`}>
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
                {isParent || isAdmin && (
                  <PhoneInput
                    variant="outline"
                    label="Телефон"
                    value={user_profile?.profile?.phone}
                    className="login-page__form-input"
                    disabled={true}
                  />
                )}
              </div>
            </div>

            {!isParent && !isAdmin && <ProfileBLock item={clickoins} generalIndex={0} />}
          </div>

          {isParent && !isAdmin && (
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

          {isParent && !isAdmin && (
            <div className="page-profile__info">
              <Icon className="page-profile__info-icon" name="info-circle-outline" />
              По всем вопросам вы можете связаться с нами по номеру телефона{" "}
              <a href={phoneToLink(phone)}>{phone}</a>
            </div>
          )}

          <Partners data={user_profile?.partners} />

          {!isParent && !isAdmin && (
            <>
              {!!user_profile?.self_study?.has_available_courses && (
                <ActiveFormats data={user_profile?.self_study.courses} />
              )}
              {user_profile?.offline_groups && user_profile.offline_groups.length > 0 && (
                <ActiveGroups data={user_profile.offline_groups} />
              )}
            </>
          )}

          {isParent && !isAdmin && (
            <div className="page-profile__childrens">
              {!!user_profile?.children?.length && (
                <div className="page-profile__childrens-header">
                  <div className="page-profile__childrens-left">
                    <div className="page-profile__childrens-title">Профили детей</div>
                    <div className="page-profile__childrens-text">
                      Управление учебными профилями
                    </div>
                  </div>

                  <div className="page-profile__childrens-actions">
                    <Link href={PAGES.PROFILE_PAYMENTS}>
                      <Button
                        variant="outline-green-dark"
                        className="page-profile__childrens-history"
                      >
                        История платежей
                      </Button>
                    </Link>
                    <Button
                      className="page-profile__childrens-add"
                      variant="orange"
                      onClick={handleCreateChildren}
                    >
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
                          <Popover
                            variant="hover"
                            positionX="right"
                            positionY="bottom"
                            content={METRICS.klikcoins.info}
                            className="children-details-page__general_headline-info"
                            popoverClassName="children-details-page__general_headline-info-popover"
                          >
                            <Icon
                              className="page-profile__children-icon"
                              name="info-circle-outline"
                            />
                          </Popover>
                          {child?.metrics?.klikcoins || 0}{" "}
                          {getPlural(
                            child?.metrics?.klikcoins ?? 0,
                            METRICS.klikcoins.plural as [string, string, string]
                          )}
                        </div>

                        <div className="page-profile__children-tag">
                          <Popover
                            variant="hover"
                            positionX="right"
                            positionY="bottom"
                            content={METRICS.balance.info}
                            className="children-details-page__general_headline-info"
                            popoverClassName="children-details-page__general_headline-info-popover"
                          >
                            <Icon
                              className="page-profile__children-icon"
                              name="info-circle-outline"
                            />
                          </Popover>
                          {child?.metrics?.balance} бел. руб.
                        </div>

                        <div className="page-profile__children-tag">
                          {child?.metrics?.paid_lessons_count || 0}{" "}
                          {getPlural(
                            child?.metrics?.paid_lessons_count ?? 0,
                            METRICS.homework.plural as [string, string, string]
                          )}
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

                      <div className="page-profile__children-wrapper">
                        <div className="page-profile__children-block">
                          <div className="page-profile__children-title">
                            <Icon className="page-profile__children-icon" name="people" />
                            Оффлайн занятия в группе
                          </div>

                          <div className="page-profile__children-list">
                            <div className="page-profile__children-item">
                              <Icon className="page-profile__children-icon" name="disk" />
                              Программа «Креаторы» :
                              <span>
                                <a href="https://t.me/Klik-tg-chat">@Klik-tg-chat</a>
                              </span>
                            </div>

                            <div className="page-profile__children-item">
                              <Icon className="page-profile__children-icon" name="disk" />
                              Программа «Лето» :
                              <span>
                                <a href="https://t.me/Klik-tg-chat">@Klik-tg-chat</a>
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="main-light-outline"
                          className="page-profile__children-pay"
                          onClick={() => handleCreatePayment(child.id)}
                        >
                          Оплатить обучение
                        </Button>
                      </div>

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
