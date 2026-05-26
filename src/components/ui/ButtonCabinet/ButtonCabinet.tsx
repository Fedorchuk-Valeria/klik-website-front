"use client";

import { useRouter } from "next/navigation";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { PAGES } from "@/src/utils/constant";
import { useAuth } from "@/src/utils/useAuth";

export default function ButtonCabinet() {
  const router = useRouter();

  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      router.push(PAGES.PROFILE);
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
