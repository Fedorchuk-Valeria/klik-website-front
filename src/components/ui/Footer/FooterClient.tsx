"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

import cookiePolicyPdf from "@/src/assets/files/cookie-policy.pdf";
import privacyPolicyPdf from "@/src/assets/files/personal-data.pdf";

import FooterSticker from "@/src/assets/images/footer_sticker.svg";
import LogoFillSvg from "@/src/assets/images/logo-fill.svg";
import LogoSvg from "@/src/assets/images/logo.svg";

import type { FooterInfo, FooterWidget } from "@/src/components/ui/Footer/Footer.types";
import FooterBlock from "@/src/components/ui/Footer/FooterBlock";
import FooterLinks from "@/src/components/ui/Footer/FooterLinks";
import Socials from "@/src/components/ui/Socials/Socials";

import { MenuItem } from "@/src/lib/content/types";
import { CitySettings } from "@/src/lib/getCitySettings";
import { PAGE_ANCHORS, PAGES } from "@/src/utils/constant";

type Props = {
  settings: CitySettings;
};

export default function FooterClient({ settings }: Props) {
  const pathname = usePathname();
  const isProgram = pathname.includes("/program");

  const footerLinks: MenuItem[] = [
    {
      url: cookiePolicyPdf,
      title: "Политика обработки файлов cookies",
    },
    {
      url: privacyPolicyPdf,
      title: "Политика конфиденциальности",
    },
  ];

  const footerInfo = (s: CitySettings): FooterInfo[] => [
    {
      title: "Главный офис",
      icon: "pin",
      text: s.address ?? "",
      type: "text",
    },
    {
      title: "Телефон",
      icon: "call",
      type: "phone",
      value: s.phone ?? "",
    },
    {
      title: "Email",
      icon: "mail",
      type: "email",
      value: s.email ?? "",
    },
  ];

  const items = footerInfo(settings);

  const footerWidgets: FooterWidget[] = [
    {
      title: "О школе",
      links: [
        {
          title: "О нас",
          url: `#${PAGE_ANCHORS.ABOUT}`,
        },
        {
          title: "Города",
          action: "openCities",
        },
        {
          title: "Наставники",
          url: `#${PAGE_ANCHORS.TUTORS}`,
        },
        {
          title: "Отзывы",
          url: `#${PAGE_ANCHORS.REVIEWS}`,
        },
      ],
    },
    {
      title: "Обучение",
      links: [
        {
          title: "Форматы обучения",
          url: `#${PAGE_ANCHORS.FORMATS}`,
        },
        {
          title: "Чему обучаем",
          url: `#${PAGE_ANCHORS.WHAT}`,
        },
        {
          title: "Программы обучения",
          url: `#${PAGE_ANCHORS.PROGRAMS}`,
        },
      ],
    },
    {
      title: "Помощь",
      links: [
        {
          title: "FAQ",
          url: `#${PAGE_ANCHORS.FAQ}`,
        },
        {
          title: "Контактная информация",
          url: `${PAGES.CONTACTS_PAGE}`,
        },
      ],
    },
  ];

  return (
    <footer className={classNames("footer", { "footer--secondary": isProgram })}>
      <div className="footer__sticker">
        <FooterSticker />
      </div>

      <div className="footer__container">
        <div className="footer__body">
          <div className="footer__left">
            <div className="footer__brand">
              <div className="footer__logo">
                {!isProgram && <LogoSvg />}
                {isProgram && <LogoFillSvg />}
              </div>

              <div className="footer__logo-text">
                Дополнительное IT-образование для детей 6–16 лет
              </div>
            </div>

            {settings?.socials && (
              <div className="footer__socials">
                <Socials socials={settings.socials} />
              </div>
            )}
          </div>

          <div className="footer__right">
            <div className="footer__info">
              <div className="footer__row">
                {items.map((item, index) => (
                  <FooterBlock item={item} key={index} />
                ))}
              </div>

              {footerWidgets?.length > 0 && (
                <div className="footer__widgets">
                  {footerWidgets.map((widget, index) => (
                    <div key={index} className="footer__widget">
                      <div className="footer__widget-title">{widget.title}</div>
                      <ul className="footer__widget-list">
                        {widget.links?.map((link, linkIndex) => (
                          <FooterLinks key={linkIndex} link={link} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-wrapper">
            <div className="footer__bottom-item footer__bottom-item--first">
              <div className="footer__bottom-copyright">
                © 2026 KLiK – Дополнительное IT-образование для детей. Все права защищены
              </div>

              <ul className="footer__links">
                {footerLinks.map((item, index) => (
                  <Link key={index} href={item.url ?? ""} target="_blank" rel="noopener noreferrer">
                    <li className="footer__links-item">{item.title}</li>
                  </Link>
                ))}
              </ul>
            </div>

            <div className="footer__bottom-item footer__bottom-item--second">
              <p>
                Ресурс зарегистрирован в Торговом реестре Республики Беларусь 11.06.2026 с номером
                №216355
              </p>
              <p>
                ООО «ТАЙМКЛИК», УНП 193397920, зарегистрировано Минским горисполкомом 11.03.2020
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
