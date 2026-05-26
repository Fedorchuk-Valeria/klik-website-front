import Image from "next/image";
import { FC, memo } from "react";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

type PropTypes = {
  title: string;
  price: number;
  imageUrl?: string;
  isPayment?: boolean;
  infoList?: string[];
  description: string;
  categories: string[];
};

const CourseAbout: FC<PropTypes> = ({
  title,
  price,
  infoList,
  categories,
  description,
  isPayment = false,
  imageUrl = "https://placehold.net/default.png",
}) => {
  return (
    <div className="course-about">
      <div className="course-about__image">
        <Image src={imageUrl} alt={title} fill />

        {isPayment && (
          <div className="course-about__purchased">
            <Icon name="success-circle" />
            <p>Куплен</p>
          </div>
        )}

        <div className="course-about__categories">
          {categories.map((category) => (
            <span key={category} className="course-about__category">
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="course-about__info">
        <p className="course-about__info-title">{title}</p>
        <p className="course-about__info-description">{description}</p>

        <p className="course-about__info-price">
          <p>{price}</p>
          <Icon name="ruble" />
        </p>

        <Button className="course-about__info-button" variant="main-green-dark" withArrow>
          {isPayment ? "Продолжить обучение" : "Оплатить курс"}
        </Button>

        {!!infoList && (
          <ul className="course-about__info-list">
            {infoList.map((item) => (
              <li key={item}>
                <Icon name="success-circle" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default memo(CourseAbout);
