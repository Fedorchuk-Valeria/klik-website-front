"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import Button from "@/src/components/ui/Button/Button";
import ButtonCabinet from "@/src/components/ui/ButtonCabinet/ButtonCabinet";
import Icon from "@/src/components/ui/Icon/Icon";

import { RootStore } from "@/src/store";
import { useAppDispatch } from "@/src/store/hooks";
import { logoutRequest } from "@/src/store/slices/auth";

import { UserProfile } from "@/src/entities/common";
import { PAGES, USER } from "@/src/utils/constant";
import localStorage from "@/src/utils/helpers/localStorage";
import { useAuth } from "@/src/utils/useAuth";

const HeaderAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user_profile } = useSelector((state: RootStore) => state.auth);

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
          {user?.full_name || user_profile?.full_name}
        </Button>
      )}

      <Button className="header__logout-button" onClick={handleLogout}>
        <Icon className="header__logout-icon" name="logout" />
        <span className="header__logout-text">Выход</span>
      </Button>
    </div>
  );
};

export default HeaderAuth;
