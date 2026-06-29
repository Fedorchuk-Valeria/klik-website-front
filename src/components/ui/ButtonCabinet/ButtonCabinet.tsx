"use client";

import { useRouter } from "next/navigation";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import {BRANCH_CRM_ID, PAGES} from "@/src/utils/constant";
import { useAuth } from "@/src/utils/useAuth";
import cookie from "@/src/utils/helpers/cookie";
import {CookieHelper} from "@/src/utils/helpers";

type Props = {
  city: string;
};

export default function ButtonCabinet({city}: Props) {
  const router = useRouter();

  let branch = '5';

  switch (city) {
    case "minsk":
      branch = '1';
      break;
    case "baranovichi":
      branch = '2';
      break;
    case "borisov":
      branch =  '3';
      break;
    case "novopolotsk":
      branch = '4';
      break;
  }

  CookieHelper.setCookie(BRANCH_CRM_ID, branch);

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
      <span>Личный кабинет</span>
    </Button>
  );
}
