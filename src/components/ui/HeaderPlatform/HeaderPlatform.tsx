import LogoSvg from "@/src/assets/images/logo-fill.svg";

import ButtonCabinet from "@/src/components/ui/ButtonCabinet/ButtonCabinet";
import Link from "next/link";
import {PAGES} from "@/src/utils/constant";
import Icon from "@/src/components/ui/Icon/Icon";
import Button from "@/src/components/ui/Button/Button";

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
                <div className="header__auth">
                  <Button className="header__user-button">
                    <Icon className="header__user-icon" name="user" />
                    Иванов Иван Иванович
                  </Button>
                  <Button className="header__logout-button">
                    <Icon className="header__logout-icon" name="logout" />
                    Выход
                  </Button>
                </div>
                <div className="header__cabinet">
                  <ButtonCabinet />
                </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
