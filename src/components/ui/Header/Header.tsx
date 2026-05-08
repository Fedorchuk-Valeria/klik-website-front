import LogoSvg from "@/src/assets/images/logo.svg";
import Socials from "@/src/components/ui/Socials/Socials";
import HeaderMenu from "@/src/components/ui/HeaderMenu/HeaderMenu";
import CitySwitcher from "@/src/components/ui/CitySwitcher/CitySwitcher";
import { getCities } from "@/src/lib/getCities";
import { headers } from "next/headers";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import {getCitySettings} from "@/src/lib/getCitySettings";
import {phoneToLink} from "@/src/lib/utils/phoneLink";
import Link from "next/link";

export default async function Header() {
  const cities = await getCities();

  const headersList = await headers();
  const slug = headersList.get("x-city") ?? "minsk";

  const currentCity = cities.find((city) => city.slug === slug) || cities[0];
  const settings = getCitySettings(currentCity.slug);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__wrapper">
          <div className="header__top header__row">
            <div className="header__left">
              <div className="header__brand">
                <Link className="header__logo" href="/">
                  <LogoSvg />
                </Link>
                <div className="header__logo-text">
                  Дополнительное
                  <br />
                  IT-образование для детей
                </div>
              </div>
              <div className="header__city">
                <CitySwitcher cities={cities} currentCity={currentCity} />
              </div>
            </div>
            <div className="header__right">
            {settings?.socials && <div className="header__socials">
                <Socials socials={settings.socials} />
            </div>}
              <div className="header__cabinet">
                <Button className="header__cabinet-button">
                  <Icon className="header__cabinet-icon" name="user" />
                  Личный кабинет
                </Button>
              </div>
            </div>
          </div>
          <div className="header__bottom header__row">
            <div className="header__left">
              <HeaderMenu />
            </div>
            <div className="header__right last">
             {settings?.phone &&
              <a className="header__phone" href={phoneToLink(settings.phone)}>{settings.phone}</a>
             }
              <Button className="header__call" variant="main-light">
                Записаться
              </Button>
              <button>
                121
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
