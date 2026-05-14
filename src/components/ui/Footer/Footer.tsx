import { headers } from "next/headers";

import FooterSticker from "@/src/assets/images/footer_sticker.svg";
import LogoFillSvg from "@/src/assets/images/logo-fill.svg";
import LogoSvg from "@/src/assets/images/logo.svg";

import FooterBlock from "@/src/components/ui/Footer/FooterBlock";
import FooterLinks from "@/src/components/ui/Footer/FooterLinks";
import Socials from "@/src/components/ui/Socials/Socials";

import { MenuItem } from "@/src/lib/content/types";
import { CitySettings, getCitySettings } from "@/src/lib/getCitySettings";
import { PAGE_ANCHORS } from "@/src/utils/constant";
import classNames from "classnames";

export type FooterInfo =
  | {
      title: string;
      icon: string;
      text: string;
      type: "text";
    }
  | {
      title: string;
      icon: string;
      type: "phone" | "email";
      value: string;
    };

type FooterWidget = {
  title: string;
  links?: MenuItem[];
};

export default async function Footer() {
  const headersList = await headers();
  const slug = headersList.get("x-city") ?? "minsk";
  const pathname = headersList.get("x-pathname") ?? "/";

  const settings = getCitySettings(slug);

  const footerLinks: MenuItem[] = [
    {
      url: "#",
      title: "Политика обработки файлов cookies",
    },
    {
      url: "#",
      title: "Политика конфиденциальности",
    },
  ];

  const footerInfo = (settings: CitySettings): FooterInfo[] => [
    {
      title: "Главный офис",
      icon: "pin",
      text: settings.address ?? "",
      type: "text",
    },
    {
      title: "Телефон",
      icon: "call",
      type: "phone",
      value: settings.phone ?? "",
    },
    {
      title: "Email",
      icon: "mail",
      type: "email",
      value: settings.email ?? "",
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
      ],
    },
  ];

  const isProgram = pathname.includes("/program");

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
                KLiK — дополнительное IT-образование детей 6–16 лет
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
            <div className="footer__bottom-copyright">
              © 2026 Дополнительное IT-образование для детей. Все права защищены
            </div>

            <ul className="footer__links">
              {footerLinks.map((item, index) => (
                <li className="footer__links-item" key={index}>
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
