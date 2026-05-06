import classNames from "classnames";
import Image, { type StaticImageData } from "next/image";
import { FC } from "react";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import TextBorder from "@/src/components/ui/TextBorder";

import image1 from "@/src/assets/images/templates/homepage/aboutUs/1.png";
import girlImg from "@/src/assets/images/templates/homepage/aboutUs/girl.png";

import { AboutUsContentItem, AboutUsSlideContentItem } from "@/src/lib/content/types";

const ABOUT_US_SLIDE_IMAGES: Record<number, StaticImageData> = {
  1: image1,
};

type PropTypes = {
  tag?: string;
  title?: string;
  text?: string;
  subtitle?: string;
  items?: AboutUsContentItem[];
  slides?: AboutUsSlideContentItem[];
};

// TODO slides on image
// TODO responsive
const AboutUs: FC<PropTypes> = ({ tag, title, text, subtitle, items, slides }) => {
  return (
    <section className="home-page__about-us">
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
            <TextBorder text="Дополнительное IT-образование для детей" cornerRadius={60}>
              <div className="home-page__about-us--text-image">
                <Image
                  alt="girl"
                  src={girlImg}
                  width={girlImg.width}
                  height={girlImg.height}
                  sizes="(max-width: 785px) 100vw, 785px"
                  className="home-page__about-us--text-image-photo"
                />

                {slides && (
                  <div className="home-page__about-us--slider">
                    {slides.map((slide) => {
                      const slideImage =
                        slide.image != null ? ABOUT_US_SLIDE_IMAGES[slide.image] : undefined;

                      return (
                        <div
                          className={classNames(
                            "home-page__about-us--slider-item",
                            `home-page__about-us--slider-item__${slide.type}`
                          )}
                          key={slide.id}
                        >
                          {slide.type === "info-success" && (
                            <div className="home-page__about-us--slider-item-success">
                              <Icon name="success" />
                            </div>
                          )}

                          {slideImage && (
                            <div className="home-page__about-us--slider-item-image">
                              <Image fill src={slideImage} alt={slide.title} />
                            </div>
                          )}

                          <span className="home-page__about-us--slider-item-title">
                            {slide.title}
                          </span>

                          {(slide.tag || slide.link) && (
                            <div className="home-page__about-us--slider-item-footer">
                              {slide.tag && (
                                <span className="home-page__tag home-page__about-us--slider-item-tag">
                                  {slide.tag}
                                </span>
                              )}

                              {slide.link && (
                                <Button
                                  variant="main-green-dark"
                                  className="home-page__about-us--slider-item-button"
                                >
                                  <Icon name="arrow-long" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TextBorder>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
