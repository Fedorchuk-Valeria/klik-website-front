import classNames from "classnames";
import Image from "next/image";
import { FC } from "react";

import Button, { ButtonVariant } from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import BottomSVG from "@/src/assets/images/templates/homepage/howSignUp/bottom.svg";
import lastCardImage from "@/src/assets/images/templates/homepage/howSignUp/how_sign_up.jpg";
import LeafSVG from "@/src/assets/images/templates/homepage/howSignUp/leaf.svg";
import TopSVG from "@/src/assets/images/templates/homepage/howSignUp/top.svg";

import HowSignUpDropdownItem from "./HowSignUpDropdownItem";

type PropTypes = {
  tag: string;
  title: string;
  text: string;
  items: {
    id: number;
    title: string;
    subtitle: string;
    text: string;
    isButton: boolean;
    button: {
      title: string;
      variant: string;
    };
    isDropdown: boolean;
    list: {
      icon_variant: string;
      items: string[];
    };
    dropdown: {
      title: string;
      text: string;
    }[];
  }[];
}

const HowSignUp: FC<PropTypes> = ({ tag, title, text, items }) => {
  return (
    <section className="home-page__block">
      <div className="how-sign-up">
        <div className="home-page__headline">
          {tag && <div className="home-page__tag">{tag}</div>}

          <div className={classNames("home-page__formats-top", "how-sign-up-top")}>
            {title && <h2 className={classNames("home-page__h2", "how-sign-up__title")}>{title}</h2>}
            {text && <div className={classNames("home-page__text", "how-sign-up__text")}>{text}</div>}
          </div>
        </div>

        <div className="how-sign-up-body">
          {items.map((item, index, array) => (
            <div className={classNames("how-sign-up__card", {
              "how-sign-up__card--last": index === array.length - 1,
              "how-sign-up__card--second": index === 1,
            })} key={item.id}>
              <span
                className={classNames("how-sign-up__card-leaf", {
                  "how-sign-up__card-leaf--placement-first": index === 0,
                  "how-sign-up__card-leaf--placement-second": index === 1,
                  "how-sign-up__card-leaf--placement-last":
                    index === array.length - 1 && array.length >= 3,
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

                <div className="how-sign-up__card-number">0{index + 1}</div>
              </div>

              <div className="how-sign-up-item__text">{item.text}</div>

              {item?.list?.items?.length && <ul className="how-sign-up__card-list">
                {item.list.items.map((listItem, index) => (
                  <li className="how-sign-up__card-list--item" key={index}>
                    <Icon name="disk" className={classNames("how-sign-up__card-list--item-icon", `how-sign-up__card-list--item-icon--${item.list.icon_variant}`)} />

                    <span className="how-sign-up__card-list--item-text">{listItem}</span>
                  </li>
                ))}
              </ul>}

              {item.isDropdown && (
                <div className="how-sign-up__card-dropdown">
                  {item.dropdown.map((dropdown, index) => (
                    <HowSignUpDropdownItem
                      key={index}
                      title={dropdown.title}
                      text={dropdown.text}
                      defaultOpen={index === 0}
                    />
                  ))}
                </div>
              )}

              {item.isButton && <Button withArrow variant={item.button.variant as ButtonVariant} className="how-sign-up__card-button">{item.button.title}</Button>}
            </div>
          ))}
        </div>

        <div className={classNames('how-sign-up__icon', 'how-sign-up__icon--top')}>
          <TopSVG />
        </div>

        <div className={classNames('how-sign-up__icon', 'how-sign-up__icon--bottom')}>
          <BottomSVG />
        </div>
      </div>
    </section>
  )
}

export default HowSignUp
