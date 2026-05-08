import LogoSvg from "@/src/assets/images/logo.svg";
import Socials from "@/src/components/ui/Socials/Socials";
import HeaderMenu from "@/src/components/ui/HeaderMenu/HeaderMenu";
import CitySwitcher from "@/src/components/ui/CitySwitcher/CitySwitcher";
import { getCities } from "@/src/lib/getCities";
import { headers } from "next/headers";
import Button from "@/src/components/ui/Button/Button";
import {getCitySettings} from "@/src/lib/getCitySettings";
import {phoneToLink} from "@/src/lib/utils/phoneLink";
import Link from "next/link";
import HeaderMobileMenu from "@/src/components/HeaderMobileMenu/HeaderMobileMenu";
import ButtonCabinet from "@/src/components/ui/ButtonCabinet/ButtonCabinet";
import {PAGE_ANCHORS} from "@/src/utils/constant";
import ButtonCall from "@/src/components/ui/ButtonCall/ButtonCall";

export default async function Header() {
  const cities = await getCities();

  const headersList = await headers();
  const slug = headersList.get("x-city") ?? "minsk";

  const currentCity = cities.find((city) => city.slug === slug) || cities[0];
  const settings = getCitySettings(currentCity.slug);

  const menuItems = [
    {
      url: `#${PAGE_ANCHORS.ABOUT}`,
      title: "О Школе",
    },
    {
      url: `#${PAGE_ANCHORS.PROGRAMS}`,
      title: "Программы",
    },
    {
      url: `#${PAGE_ANCHORS.LOCATION}`,
      title: "Локации",
    },
    {
      url: `#${PAGE_ANCHORS.REVIEWS}`,
      title: "Отзывы",
    },
    {
      url: `#${PAGE_ANCHORS.FAQ}`,
      title: "FAQ",
    },
  ];

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
                <ButtonCabinet />
              </div>
            </div>
          </div>
          <div className="header__bottom header__row">
            <div className="header__left">
              <HeaderMenu menuItems={menuItems} />
            </div>
            <div className="header__right last">
             {settings?.phone &&
              <a className="header__phone" href={phoneToLink(settings.phone)}>{settings.phone}</a>
             }
              <ButtonCall />
            </div>
          </div>
          <HeaderMobileMenu phone={settings.phone} currentCity={currentCity} cities={cities} socials={settings.socials ?? []} menuItems={menuItems}  />
        </div>
      </div>
    </header>
  );
}
