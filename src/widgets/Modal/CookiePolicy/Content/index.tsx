import Link from "next/link";
import { FC } from "react";

import Button from "@/src/components/ui/Button/Button";

import { setClientCookie } from "@/src/utils/clientCookies";
import { COOKIE_CONSENT_STORAGE_KEY } from "@/src/utils/constant";
import { applyGtagConsentWhenAccepted } from "@/src/utils/gaConsent";

type PropTypes = {
  onClose?: () => void;
};

const CookiePolicyContent: FC<PropTypes> = ({ onClose }) => {
  const handleAccept = () => {
    if (typeof window !== "undefined") {
      setClientCookie(COOKIE_CONSENT_STORAGE_KEY, "true");

      applyGtagConsentWhenAccepted();
      onClose?.();
    }
  };

  return (
    <div>
      <h1 className={"cookie-policy-content__title"}>Обработка файлов cookie</h1>

      <p className={"cookie-policy-content__description"}>
        Наш сайт использует только технические, необходимые для работы сайта cookie, которые не
        могут быть отключены. Более подробно вы можете ознакомиться о них на странице{" "}
        <Link href={"#"} target="_blank" className={"cookie-policy-content__link"}>
          Политика обработки cookie
        </Link>
        .
      </p>

      <Button
        className={"cookie-policy-content__button"}
        variant="main-green-dark"
        onClick={handleAccept}
      >
        Ок
      </Button>
    </div>
  );
};

export default CookiePolicyContent;
