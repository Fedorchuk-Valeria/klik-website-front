import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, memo } from "react";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { PAGES, QUERY_PARAMS } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";

import { CourseCategory } from "@/src/lib/getCourses";
import { useAuth } from "@/src/utils/useAuth";

type PropTypes = {
  title: string;
  price: number;
  imageUrl?: string;
  isPayment?: boolean;
  infoList?: string[];
  description: string;
  categories: CourseCategory[];
  onPayment: () => void;
};

const CourseAbout: FC<PropTypes> = ({
  title,
  price,
  infoList,
  categories,
  description,
  isPayment = false,
  imageUrl = "https://placehold.net/default.png",
  onPayment,
}) => {
  const router = useRouter();
  const { isAuthenticated, isMounted } = useAuth();

  const handleClick = () => {
    if (!isMounted) return;

    if (!isAuthenticated) {
      router.push(PAGES.LOGIN);
      return;
    }

    if (isPayment) {
      router.push(
        PAGES.COURSES +
          QueryHelper.getQueryString({
            [QUERY_PARAMS.CATEGORIES]: categories.map((category) => category.slug).join(","),
            [QUERY_PARAMS.FILTER]: "all",
          })
      );

      return;
    }

    onPayment();
  };

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
            <span key={category.id} className="course-about__category">
              {category.name}
            </span>
          ))}
        </div>
      </div>

      <div className="course-about__info">
        <p className="course-about__info-title">{title}</p>
        <p className="course-about__info-description">{description}</p>

        <p className="course-about__info-price">
          <span>{price?.toLocaleString("ru-RU")}</span>
          <Icon name="ruble" />
        </p>

        <Button
          className="course-about__info-button"
          variant="main-green-dark"
          onClick={handleClick}
          withArrow
        >
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
