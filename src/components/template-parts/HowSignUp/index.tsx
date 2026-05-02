import classNames from "classnames";
import { FC } from "react";

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
    }[];
    dropdown: {
      title: string;
      text: string;
    }[];
  }[];
}

const HowSignUp: FC<PropTypes> = ({ tag, title, text, items }) => {
  return (
    <section>
      <div className={classNames("home-page__block", "how-sign-up")}>
        <div className="home-page__headline">
          {tag && <div className="home-page__tag">{tag}</div>}

          <div className={classNames("home-page__formats-top", "how-sign-up-top")}>
            {title && <h2 className={classNames("home-page__h2", "how-sign-up__title")}>{title}</h2>}
            {text && <div className={classNames("home-page__text", "how-sign-up__text")}>{text}</div>}
          </div>
        </div>

        <div className="how-sign-up-body"></div>
      </div>
    </section>
  )
}

export default HowSignUp
