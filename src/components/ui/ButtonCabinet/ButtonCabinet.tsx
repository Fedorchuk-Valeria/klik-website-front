"use client";

import { useRouter } from "next/navigation";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { PAGES, REFRESH_TOKEN_KEY, TOKEN_KEY } from "@/src/utils/constant";
import { CookieHelper } from "@/src/utils/helpers";

export default function ButtonCabinet() {
  const router = useRouter();

  const handleClick = () => {
    if (CookieHelper.getCookie(TOKEN_KEY) && CookieHelper.getCookie(REFRESH_TOKEN_KEY)) {
      router.push(PAGES.PERSONAL_ACCOUNT);
    } else {
      router.push(PAGES.LOGIN);
    }
  };

  return (
    <Button className="header__cabinet-button" onClick={handleClick}>
      <Icon className="header__cabinet-icon" name="user" />
      Личный кабинет
    </Button>
  );
}
