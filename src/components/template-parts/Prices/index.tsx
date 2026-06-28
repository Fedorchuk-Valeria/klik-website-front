"use client";

import classNames from "classnames";
import Image from "next/image";
import { FC } from "react";

import PricesBg from "@/src/assets/images/templates/homepage/prices/bg.svg";
import pricesImage from "@/src/assets/images/templates/homepage/prices/prices.jpg";
import Button from "../../ui/Button/Button";
import Icon from "../../ui/Icon/Icon";

type PropTypes = {
  tag?: string;
  title?: string;
  card_text?: string;
  price?: string;
  list?: string[];
};

const Prices: FC<PropTypes> = ({ tag, title, card_text, price, list }) => {
  return (
    <section id="prices">
      <div className={classNames("home-page__block", "home-page__prices")}>
        <div className="home-page__container">
          {tag && <div className="home-page__tag">{tag}</div>}

          <h2 className={classNames("home-page__h2", "home-page__prices-title")}>{title}</h2>

          <div className="home-page__tutors-body">
            <div className="home-page__prices-image">
              <Image src={pricesImage} alt="Prices" fill />
            </div>

            <div className="home-page__prices-card">
              <div className="home-page__prices-card_svg">
                <PricesBg />
              </div>

              <p className="home-page__prices-card_text">{card_text}</p>

              <div className="home-page__prices-card_price">
                <p className="home-page__prices-card_price-text">
                  от {price} <Icon name="ruble" />
                </p>

                <p className="home-page__prices-card_price-description">за занятие</p>
              </div>

              <ul className="home-page__prices-card_list">
                {list?.map((item) => (
                  <li key={item}>
                    <Icon name="disk" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button className="home-page__prices-card_button" variant="main-green-dark" withArrow>
                Оставить заявку
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Prices;
