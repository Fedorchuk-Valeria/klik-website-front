import Image from "next/image";
import { FC } from "react";

import girlImg from "@/src/assets/images/templates/homepage/aboutUs/girl.png";
import HeartSVG from "@/src/assets/images/templates/homepage/aboutUs/heart.svg";

import AboutUsSlider from "@/src/components/template-parts/AboutUs/AboutUsSlider";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import TextBorder from "@/src/components/ui/TextBorder";

import { AboutUsContentItem, AboutUsSlideContentItem } from "@/src/lib/content/types";

type PropTypes = {
  tag?: string;
  title?: string;
  text?: string;
  subtitle?: string;
  items?: AboutUsContentItem[];
  slides?: AboutUsSlideContentItem[];
};

const AboutUs: FC<PropTypes> = ({ title, text, subtitle, items, slides }) => {
  return (
    <section id="about-us" className="home-page__about-us">
      <div className="home-page__block">
        <div className="home-page__container">
          <div className="home-page__about-us--block">
            {subtitle && <span className="home-page__about-us--tag">{subtitle}</span>}

            {title && <h2 className="home-page__h2 home-page__about-us--title">{title}</h2>}

            {text && <p className="home-page__about-us--text">{text}</p>}

            {!!items && (
              <ul className="home-page__about-us--list">
                {items?.map((item, index) => (
                  <li className="home-page__about-us--list-item" key={index}>
                    <span
                      className="home-page__about-us--list-item-icon"
                      style={{ backgroundColor: `var(--${item.color})` }}
                    >
                      <Icon name={item.icon} />
                    </span>

                    <p className="home-page__about-us--list-item-title">{item.title}</p>
                    <p className="home-page__about-us--list-item-text">{item.text}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="home-page__about-us--actions">
              <Button variant="main-green-dark" withArrow={true}>
                Записаться на курс
              </Button>

              <Button variant="outline-green-dark">Смотреть программы</Button>
            </div>
          </div>

          <div className="home-page__about-us--block">
            <span className="home-page__about-us--heart">
              <HeartSVG />
            </span>

            <TextBorder
              text="Дополнительное IT-образование для детей"
              cornerRadius={60}
              cornerRadiusByWidth={{ 1920: 60, 1440: 50, 1024: 30, 800: 50, 500: 40 }}
            >
              <div className="home-page__about-us--text-image">
                <Image
                  alt="girl"
                  src={girlImg}
                  width={girlImg.width}
                  height={girlImg.height}
                  sizes="(max-width: 785px) 100vw, 785px"
                  className="home-page__about-us--text-image-photo"
                />

                {slides && <AboutUsSlider slides={slides} />}
              </div>
            </TextBorder>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
