"use client";

import Button from "@/src/components/ui/Button/Button";
import ButtonCabinet from "@/src/components/ui/ButtonCabinet/ButtonCabinet";
import Icon from "@/src/components/ui/Icon/Icon";

import { useAppDispatch } from "@/src/store/hooks";

import { logoutRequest } from "@/src/store/slices/auth";
import {useAuth} from "@/src/utils/useAuth";
import localStorage from "@/src/utils/helpers/localStorage";
import {USER} from "@/src/utils/constant";
import {UserProfile} from "@/src/entities/common";

const HeaderAuth = () => {
  const dispatch = useAppDispatch();

  const { isAuthenticated, isMounted } = useAuth();

  const user = localStorage.getStorageItem<UserProfile>(USER);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="header__cabinet">
        <ButtonCabinet />
      </div>
    );
  }

  return (
    <div className="header__auth">
      <Button className="header__user-button">
        <Icon className="header__user-icon" name="user" />
        {user?.full_name}
      </Button>

      <Button
        className="header__logout-button"
        onClick={handleLogout}
      >
        <Icon className="header__logout-icon" name="logout" />
        Выход
      </Button>
    </div>
  );
};

export default HeaderAuth;
