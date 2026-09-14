import LogoSvg from "@/src/assets/images/logo.svg";
import { headers } from "next/headers";

import HeaderMobileMenu from "@/src/components/HeaderMobileMenu/HeaderMobileMenu";
import { HeaderMobileMenuProvider } from "@/src/components/HeaderMobileMenu/HeaderMobileMenuContext";
import ButtonCabinet from "@/src/components/ui/ButtonCabinet/ButtonCabinet";
import ButtonCall from "@/src/components/ui/ButtonCall/ButtonCall";
import CitySwitcher from "@/src/components/ui/CitySwitcher/CitySwitcher";
import HeaderLogoLink from "@/src/components/ui/Header/HeaderLogoLink";
import HeaderMenu from "@/src/components/ui/HeaderMenu/HeaderMenu";
import Socials from "@/src/components/ui/Socials/Socials";

import { getCities } from "@/src/lib/getCities";
import { getCitySettings } from "@/src/lib/getCitySettings";
import { getHomeLocations } from "@/src/lib/getLocations";
import { phoneToLink } from "@/src/lib/utils/phoneLink";
import { PAGE_ANCHORS } from "@/src/utils/constant";
import HeaderScroll from "@/src/components/ui/HeaderScroll";

export default async function Header() {
  const cities = getCities();
  const [location, headersList] = await Promise.all([getHomeLocations(), headers()]);
  const slug = headersList.get("x-city") ?? "minsk";

  const currentCity = cities.find((city) => city.slug === slug) || cities[0];
  const settings = getCitySettings(currentCity.slug);
  const onlineRegistrationUrl = location?.online_registration_url;

  const menuItems = [
    {
      url: `#${PAGE_ANCHORS.ABOUT}`,
      title: "О школе",
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
      <HeaderScroll />

      <div className="header__container">
        <HeaderMobileMenuProvider>
          <div className="header__wrapper">
            <div className="header__brand">
              <HeaderLogoLink className="header__logo">
                <LogoSvg />
              </HeaderLogoLink>

              <div className="header__logo-text">
                Дополнительное
                <br />
                IT-образование для детей
              </div>
            </div>

            <div className="header__city">
              <CitySwitcher
                cities={cities}
                currentCity={currentCity}
              />
            </div>

            {settings?.socials && (
              <div className="header__socials">
                <Socials socials={settings.socials} />
              </div>
            )}

            <div className="header__cabinet">
              <ButtonCabinet />
            </div>

            <nav className="header__menu">
              <HeaderMenu menuItems={menuItems} />
            </nav>

            {settings?.phone && (
              <a
                className="header__phone"
                href={phoneToLink(settings.phone)}
              >
                {settings.phone}
              </a>
            )}

            <div className="header__call">
              <ButtonCall href={onlineRegistrationUrl} />
            </div>

            <HeaderMobileMenu
              phone={settings.phone}
              currentCity={currentCity}
              cities={cities}
              socials={settings.socials ?? []}
              menuItems={menuItems}
              onlineRegistrationUrl={onlineRegistrationUrl}
            />
          </div>
        </HeaderMobileMenuProvider>
      </div>
    </header>
  );
}
