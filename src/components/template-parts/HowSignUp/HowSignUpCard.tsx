import classNames from "classnames";
import Image from "next/image";

import lastCardImage from "@/src/assets/images/templates/homepage/howSignUp/how_sign_up.jpg";
import LeafSVG from "@/src/assets/images/templates/homepage/howSignUp/leaf.svg";

import { HowSignUpItem } from "@/src/components/template-parts/HowSignUp";
import HowSignUpDropdownItem from "@/src/components/template-parts/HowSignUp/HowSignUpDropdownItem";
import Button, { ButtonVariant } from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

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
        <p className="how-sign-up__card-headline-text">
          <span className="how-sign-up__card-title">{item.title}</span>
          <span className="how-sign-up__card-subtitle">{item.subtitle}</span>
        </p>

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

export default HowSignUpCard;
