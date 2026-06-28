import Link from "next/link";
import { FC } from "react";

import cookiePolicyPdf from "@/src/assets/files/cookie-policy.pdf";
import Button from "@/src/components/ui/Button/Button";

import { setCookieConsentForEnvironment } from "@/src/utils/clientCookies";
import { applyGtagConsentWhenAccepted } from "@/src/utils/gaConsent";

type PropTypes = {
  onClose?: () => void;
};

const CookiePolicyContent: FC<PropTypes> = ({ onClose }) => {
  const handleAccept = () => {
    if (typeof window !== "undefined") {
      setCookieConsentForEnvironment();

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
        <Link
          href={cookiePolicyPdf}
          target="_blank"
          rel="noopener noreferrer"
          className={"cookie-policy-content__link"}
        >
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
