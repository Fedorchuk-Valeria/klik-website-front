import Image from "next/image";
import Link from "next/link";

import Logo from "@/src/assets/images/logo-fill.svg";
import PasswordStar from "@/src/assets/images/view/login/password-star.svg";

import login1440 from "@/src/assets/images/view/login/log_in_1440.jpg";
import login1920 from "@/src/assets/images/view/login/log_in_1920.jpg";
import login800 from "@/src/assets/images/view/login/log_in_800.jpg";

import RegistrationBranchSync from "@/src/components/RegistrationBranchSync";

import { PAGES } from "@/src/utils/constant";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="login-page">
      <RegistrationBranchSync />

      <div className="login-page__content">
        <header className="login-page__header">
          <Link href={PAGES.HOME} className="login-page__logo">
            <Logo />
          </Link>

          <div className="login-page__logo-text">
            Дополнительное
            <br />
            IT-образование для детей
          </div>
        </header>

        <main className="login-page__main">{children}</main>
      </div>

      <div className="login-page__image">
        <Image src={login1920} alt="login" fill className="login-page__image-desktop" priority />
        <Image src={login1440} alt="login" fill className="login-page__image-tablet" priority />
        <Image src={login800} alt="login" fill className="login-page__image-mobile" priority />

        <span className="login-page__image-star">
          <PasswordStar />
        </span>
      </div>
    </div>
  );
}
