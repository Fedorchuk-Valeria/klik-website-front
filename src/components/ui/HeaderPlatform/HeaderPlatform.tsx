import LogoSvg from "@/src/assets/images/logo-fill.svg";

import Link from "next/link";
import {PAGES} from "@/src/utils/constant";
import HeaderAuth from "@/src/components/ui/HeaderPlatformAuth/HeaderPlatformAuth";

type HeaderPlatformProps = {
  variant?: "dark" | "light";
  showAuthControls?: boolean;
};

export default async function HeaderPlatform({
   variant = "dark",
   showAuthControls = true,
   }: HeaderPlatformProps) {
  return (
    <header className="header">
      <div className="header__container">
        <div className={`header__wrapper ${variant}`}>
          <div className="header__top header__row">
            <div className="header__left">
              <div className="header__brand">
                <Link className="header__logo" href={PAGES.COURSES}>
                  <LogoSvg />
                </Link>

                <div className="header__logo-text">
                  Дополнительное
                  <br />
                  IT-образование для детей
                </div>
              </div>
            </div>

            {showAuthControls && (
            <div className="header__right">
              <HeaderAuth />
            </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
