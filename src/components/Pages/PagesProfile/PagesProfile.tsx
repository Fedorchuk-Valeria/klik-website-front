"use client";

import {useAppDispatch, useAppSelector} from "@/src/store/hooks";
import {useEffect} from "react";
import {profileRequest} from "@/src/store/slices/auth";
import Loader from "@/src/components/ui/Loader/Loader";
import PhoneInput from "@/src/components/ui/PhoneInput";
import TextInput from "@/src/components/ui/TextInput";
import Link from "next/link";
import {PAGES} from "@/src/utils/constant";

import avatar from "@/src/assets/images/view/profile/avatar.png";
import Image from "next/image";
import Icon from "@/src/components/ui/Icon/Icon";

const PagesProfile = () => {

  const dispatch = useAppDispatch();

  const {user_profile, isLoading} = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(profileRequest());
  }, [dispatch]);

  if (isLoading || !user_profile) {
    return <Loader />;
  }

  return (
    <div className="page-profile">
      <div className="platform-layout__container">
        <div className="page-profile__content">
          <h1>Личный кабинет</h1>
          <div className="page-profile__wrapper">
            <Image src={avatar} alt="avatar" className="page-profile__avatar" />
            <div className="page-profile__form">
              <TextInput
                variant="outline"
                label="ФИО"
                value={user_profile.full_name}
                className="login-page__form-input"
                disabled={true}
              />
              <PhoneInput
                variant="outline"
                label="Телефон"
                value={user_profile.phone}
                className="login-page__form-input"
                disabled={true}
              />
            </div>
          </div>
          <div className="page-profile__list">
            <Link className="page-profile__link" href={PAGES.COURSES}>
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
        </div>
      </div>
    </div>
  );
};

export default PagesProfile;
