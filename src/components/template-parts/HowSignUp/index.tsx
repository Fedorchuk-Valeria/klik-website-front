"use client";

import classNames from "classnames";
import { FC, useCallback } from "react";

import BottomSVG from "@/src/assets/images/templates/homepage/howSignUp/bottom.svg";
import TopSVG from "@/src/assets/images/templates/homepage/howSignUp/top.svg";
import HowSignUpCard from "@/src/components/template-parts/HowSignUp/HowSignUpCard";

import { PAGE_ANCHORS } from "@/src/utils/constant";

const HEADER_SCROLL_OFFSET_PX = 120;

export type HowSignUpItem = {
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
