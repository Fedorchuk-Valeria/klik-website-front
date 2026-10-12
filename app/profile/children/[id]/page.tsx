"use client";

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import avatar from "@/src/assets/images/view/profile/avatar.png";

import Button from "@/src/components/ui/Button/Button";
import EditableEmailField from "@/src/components/ui/EditableEmailField";
import Icon from "@/src/components/ui/Icon/Icon";
import Loader from "@/src/components/ui/Loader/Loader";
import PhoneInput from "@/src/components/ui/PhoneInput";
import TextInput from "@/src/components/ui/TextInput";

import { METRICS, PAGES } from "@/src/utils/constant";

import { ProfileBLock } from "@/src/components/ui/ProfileBlock";
import { Group, ModalType } from "@/src/entities/common";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { showModal } from "@/src/store/slices/modalSlice";
import { getCurrentChildRequest } from "@/src/store/slices/profile";
import { Partners } from "@/src/components/ui/Partners";

type OfflineGroupField = {
  key: keyof Group;
  title: string;
  isLink?: boolean;
};

const ChildrenDetailsPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { currentChild, isLoading, errors } = useAppSelector((store) => store.profile);

  const general = useMemo(
    () => [
      {
        ...METRICS.klikcoins,
        value: currentChild?.metrics?.klikcoins ?? 0,
      },
      {
        ...METRICS.balance,
        value: currentChild?.metrics?.balance ?? 0,
      },
      {
        ...METRICS.homework,
        value: currentChild?.metrics?.paid_lessons_count ?? 0,
      },
    ],
    [currentChild?.metrics]
  );

  console.log("currentChild=", currentChild);
  console.log('genaral=', general);

  const courses = useMemo(
    () => currentChild?.self_study?.courses ?? [],
    [currentChild?.self_study?.courses]
  );

  const offlineGroupFields: OfflineGroupField[] = [
    {
      key: "day_and_time",
      title: "День и время",
    },
    {
      key: "location",
      title: "Место проведения",
    },
    {
      key: "manager_url",
      title: "Менеджер",
      isLink: true,
    },
    {
      key: "telegram_chat_url",
      title: "Telegram",
      isLink: true,
    },
    {
      key: "next_lesson_topic",
      title: "Тема следующего занятия",
    },
    {
      key: "subscription",
      title: "Абонемент",
    },
    {
      key: "discount_percent",
      title: "Скидка",
    },
  ];

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
                value={currentChild?.profile?.full_name ?? ""}
                className="login-page__form-input"
                disabled={true}
              />

              <EditableEmailField
                value={currentChild?.profile?.email ?? ""}
                childId={Number(id)}
                className="login-page__form-input"
              />

              <PhoneInput
                variant="outline"
                label="Телефон"
                value={currentChild?.profile?.phone ?? ""}
                className="login-page__form-input"
                disabled={true}
              />
            </div>
          </div>

          <Link
            className={classNames("page-profile__link", "children-details-page__link")}
            href={PAGES.PROFILE_CHILDREN_PASSWORD.replace(":id", String(id))}
          >
            Управление паролем ребенка
            <span>
              <Icon className="page-profile__link-icon" name="arrow" />
            </span>
          </Link>

          <div className="children-details-page__general">
            {general.map((item, generalIndex) => (
              <ProfileBLock key={generalIndex} item={item} generalIndex={generalIndex} />
            ))}
          </div>

          <div className="children-details-page__partners">
            <Partners data={currentChild?.partners} />
          </div>

          {currentChild?.offline_groups?.length > 0 && (
            <div className="children-details-page__offline">
              <div className="children-details-page__offline_headline">
                <p className="children-details-page__offline_headline-title">
                  Офлайн-занятия в группе
                </p>

                <div className="children-details-page__offline_headline-actions">
                  <Link href={PAGES.PROFILE_PAYMENTS}>
                    <Button variant="outline-orange">История платежей</Button>
                  </Link>

                  <Button
                    variant="main-green-dark"
                    withArrow
                    onClick={() => handleCreatePayment(Number(id))}
                  >
                    Оплатить обучение
                  </Button>
                </div>
              </div>

              <div className="children-details-page__offline_list">
                {currentChild.offline_groups.map((group) => {
                  const fields = offlineGroupFields.filter(({ key }) => {
                    const value = group[key];

                    return value !== null && value !== undefined && String(value).trim() !== "";
                  });

                  return (
                    <div key={group.id} className="children-details-page__offline_list-item">
                      <p className="children-details-page__offline_list-item-title">
                        {group.title}
                      </p>

                      <ul className="children-details-page__offline_list-item-info">
                        {fields.map((field) => {
                          const value = group[field.key];

                          return (
                            <li
                              key={field.key}
                              className="children-details-page__offline_list-item-info-item"
                            >
                              <span>{field.title}</span>

                              {field.isLink ? (
                                <a className="page-profile__tg" href={String(value)} target="_blank" rel="noopener noreferrer">
                                  <p>Перейти в TG</p>
                                </a>
                              ) : (
                                <p>{value}</p>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildrenDetailsPage;
