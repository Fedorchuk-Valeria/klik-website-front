"use client";

import {useState} from "react";
import Burger from "@/src/components/ui/Burger/Burger";
import Socials, {SocialItem} from "@/src/components/ui/Socials/Socials";
import {phoneToLink} from "@/src/lib/utils/phoneLink";
import ButtonCabinet from "@/src/components/ui/ButtonCabinet/ButtonCabinet";
import CitySwitcher from "@/src/components/ui/CitySwitcher/CitySwitcher";
import {City} from "@/src/lib/getCities";
import HeaderMobileList from "@/src/components/ui/HeaderMoblieList/HeaderMobileList";
import ButtonCall from "@/src/components/ui/ButtonCall/ButtonCall";
import MenuBg from "@/src/assets/images/mobile-menu-bg.svg";

type MenuItem = {
  url: string;
  title: string;
};

type Props = {
  phone?: string;
  currentCity: City;
  cities: City[];
  socials?: SocialItem[];
  menuItems: MenuItem[];
};

export default function HeaderMobileMenu({phone, currentCity, cities, socials = [], menuItems = []}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <div className="header__mobile-bg">
        <MenuBg />
      </div>}

      <Burger isOpen={isOpen} onClick={() => setIsOpen((v) => !v)}/>

      {isOpen && <div className="header__mobile">
        <div className="header__mobile-top">
          <div className="header__mobile-cities">
            <CitySwitcher cities={cities} currentCity={currentCity} />
          </div>
          <div className="header__mobile-cabinet">
            <ButtonCabinet />
          </div>
        </div>
        <div className="header__mobile-center">
          {menuItems.length > 0 && (
            <HeaderMobileList menuItems={menuItems} onClose={() => setIsOpen(false)} />
          )}
        </div>
        <div className="header__mobile-footer">
          {phone && (
            <a className="header__mobile-phone" href={phoneToLink(phone)}>
              {phone}
            </a>
          )}
          {socials.length > 0 && (
            <div className="header__mobile-socials">
              <Socials socials={socials}/>
            </div>
          )}
          <ButtonCall />
        </div>
      </div>}

    </>
  );
}
