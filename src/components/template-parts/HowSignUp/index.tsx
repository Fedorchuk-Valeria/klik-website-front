"use client";

import Button, { ButtonVariant } from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import classNames from "classnames";
import Image from "next/image";
import { FC, useCallback } from "react";

import BottomSVG from "@/src/assets/images/templates/homepage/howSignUp/bottom.svg";
import lastCardImage from "@/src/assets/images/templates/homepage/howSignUp/how_sign_up.jpg";
import LeafSVG from "@/src/assets/images/templates/homepage/howSignUp/leaf.svg";
import TopSVG from "@/src/assets/images/templates/homepage/howSignUp/top.svg";

import { PAGE_ANCHORS } from "@/src/utils/constant";
import HowSignUpDropdownItem from "./HowSignUpDropdownItem";

const HEADER_SCROLL_OFFSET_PX = 120;

type HowSignUpItem = {
  id: number;
  title: string;
  subtitle: string;
  text: string;
  isButton?: boolean;
  button?: {
    title: string;
    variant: string;
  };
  isDropdown?: boolean;
  list?: {
    icon_variant: string;
    items: string[];
  };
  dropdown?: {
    title: string;
    text: string;
  }[];
};

type PropTypes = {
  tag: string;
  title: string;
  text: string;
  items: HowSignUpItem[];
};

type CardProps = {
  item: HowSignUpItem;
  cardIndex: number;
  totalCards: number;
  onClick?: () => void;
};

function HowSignUpCard({ item, cardIndex, totalCards, onClick }: CardProps) {
  const list = item.list;

  return (
    <div
      className={classNames("how-sign-up__card", {
        "how-sign-up__card--last": cardIndex === totalCards - 1,
        "how-sign-up__card--second": cardIndex === 1,
      })}
    >
      <span
        className={classNames("how-sign-up__card-leaf", {
          "how-sign-up__card-leaf--placement-first": cardIndex === 0,
          "how-sign-up__card-leaf--placement-second": cardIndex === 1,
          "how-sign-up__card-leaf--placement-last": cardIndex === totalCards - 1 && totalCards >= 3,
        })}
      >
        <LeafSVG />
      </span>

      <Image
        src={lastCardImage}
        alt={item.title}
        className="how-sign-up__card-image"
        width={lastCardImage.width}
        height={lastCardImage.height}
      />

      <div className="how-sign-up__card-headline">
        <div className="how-sign-up__card-title">{item.title}</div>
        <div className="how-sign-up__card-subtitle">{item.subtitle}</div>

        <div className="how-sign-up__card-number">0{cardIndex + 1}</div>
      </div>

      <div className="how-sign-up-item__text">{item.text}</div>

      {list && list.items.length > 0 ? (
        <ul className="how-sign-up__card-list">
          {list.items.map((listItem, bulletIndex) => (
            <li className="how-sign-up__card-list--item" key={`${item.id}-bullet-${bulletIndex}`}>
              <Icon
                name="disk"
                className={classNames(
                  "how-sign-up__card-list--item-icon",
                  `how-sign-up__card-list--item-icon--${list.icon_variant}`
                )}
              />

              <span className="how-sign-up__card-list--item-text">{listItem}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {item.isDropdown && item.dropdown ? (
        <div className="how-sign-up__card-dropdown">
          {item.dropdown.map((dropdown, dropdownIndex) => (
            <HowSignUpDropdownItem
              key={`${item.id}-${dropdown.title}-${dropdownIndex}`}
              title={dropdown.title}
              text={dropdown.text}
              defaultOpen={false}
            />
          ))}
        </div>
      ) : null}

      {item.isButton && item.button ? (
        <Button
          withArrow
          variant={item.button.variant as ButtonVariant}
          className="how-sign-up__card-button"
          onClick={onClick}
        >
          {item.button.title}
        </Button>
      ) : null}
    </div>
  );
}

const HowSignUp: FC<PropTypes> = ({ tag, title, text, items }) => {
  const handleScroll = useCallback(
    (cardIndex: number) => () => {
      const hash =
        cardIndex === 0 ? `#${PAGE_ANCHORS.SIGN_UP_FREE_LESSON}` : `#${PAGE_ANCHORS.PROGRAMS}`;
      const id = hash.slice(1);
      const el = document.getElementById(id);

      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET_PX;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    []
  );

  return (
    <section id="how-sign-up" className="home-page__block">
      <div className="how-sign-up">
        <div className="home-page__headline">
          {tag && <div className="home-page__tag">{tag}</div>}

          <div className={classNames("home-page__formats-top", "how-sign-up-top")}>
            {title && (
              <h2 className={classNames("home-page__h2", "how-sign-up__title")}>{title}</h2>
            )}
            {text && (
              <div className={classNames("home-page__text", "how-sign-up__text")}>{text}</div>
            )}
          </div>
        </div>

        <div className="how-sign-up-body">
          {items.map((item, cardIndex, array) => (
            <HowSignUpCard
              key={item.id}
              item={item}
              cardIndex={cardIndex}
              totalCards={array.length}
              onClick={handleScroll(cardIndex)}
            />
          ))}
        </div>

        <div className={classNames("how-sign-up__icon", "how-sign-up__icon--top")}>
          <TopSVG />
        </div>

        <div className={classNames("how-sign-up__icon", "how-sign-up__icon--bottom")}>
          <BottomSVG />
        </div>
      </div>
    </section>
  );
};

export default HowSignUp;
