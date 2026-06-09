"use client";

import Button from "@/src/components/ui/Button/Button";
import ButtonCabinet from "@/src/components/ui/ButtonCabinet/ButtonCabinet";
import Icon from "@/src/components/ui/Icon/Icon";

import { useAppDispatch } from "@/src/store/hooks";

import { logoutRequest } from "@/src/store/slices/auth";
import {useAuth} from "@/src/utils/useAuth";
import localStorage from "@/src/utils/helpers/localStorage";
import {PAGES, USER} from "@/src/utils/constant";
import {UserProfile} from "@/src/entities/common";
import {usePathname, useRouter} from "next/navigation";

const HeaderAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isMounted } = useAuth();

  const user = localStorage.getStorageItem<UserProfile>(USER);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  const handleProfile = () => {
    router.push(PAGES.PROFILE);
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

  const isProfilePage = pathname === PAGES.PROFILE || pathname === PAGES.PROFILE_PASSWORD;

  return (
    <div className="header__auth">
      {!isProfilePage && (
        <Button className="header__user-button" onClick={handleProfile}>
          <Icon className="header__user-icon" name="user" />
          {user?.full_name}
        </Button>
      )}

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
