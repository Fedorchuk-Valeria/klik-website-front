"use client";

import {useAppDispatch, useAppSelector} from "@/src/store/hooks";
import {useEffect} from "react";
import {profileRequest} from "@/src/store/slices/auth";
import Loader from "@/src/components/ui/Loader/Loader";
import PhoneInput from "@/src/components/ui/PhoneInput";
import TextInput from "@/src/components/ui/TextInput";

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
          <h1 className="courses__title">Личный кабинет</h1>
          <div className="page-profile__wrapper">
            <div>121</div>
            <div className="page-profile__form">
              <PhoneInput
                variant="outline"
                label="Телефон"
                value={user_profile.phone}
                className="login-page__form-input"
                disabled={true}
              />
              <TextInput
                variant="outline"
                label="ФИО"
                value={user_profile.full_name}
                className="login-page__form-input"
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagesProfile;
