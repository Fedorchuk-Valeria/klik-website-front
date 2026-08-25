import classNames from "classnames";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, memo, MouseEvent, useMemo } from "react";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { PAGES, QUERY_PARAMS } from "@/src/utils/constant";
import { AuthRedirectHelper, DateHelper, QueryHelper } from "@/src/utils/helpers";

import { CourseCategory, Purchase } from "@/src/lib/getCourses";
import { checkIsAuthenticated } from "@/src/utils/useAuth";

type PropTypes = {
  title: string;
  price: number;
  imageUrl?: string;
  isPayment?: boolean;
  infoList?: string[];
  description: string;
  categories: CourseCategory[];
  onPayment: () => void;
  isChild?: boolean;
  isParentLookAtChild?: boolean;
  purchase?: Purchase | null;
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
  isChild = false,
  isParentLookAtChild = false,
  purchase = null,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const returnTo = useMemo(() => {
    const query = searchParams.toString();

    return `${pathname}${query ? `?${query}` : ""}`;
  }, [pathname, searchParams]);

  const loginHref = useMemo(() => AuthRedirectHelper.buildLoginUrl(returnTo), [returnTo]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (!checkIsAuthenticated()) {
      AuthRedirectHelper.saveAuthReturnTo(returnTo);
      return;
    }

    event.preventDefault();

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

      <div className={classNames("course-about__info")}>
        <p className="course-about__info-title">{title}</p>
        <p className="course-about__info-description">{description}</p>

        {!isChild && (
          <p className="course-about__info-price">
            <span>{price?.toLocaleString("ru-RU")}</span>
            <Icon name="ruble" />
          </p>
        )}

        {((isChild && isPayment) || !isChild) && (
          <Button
            className="course-about__info-button"
            variant="main-green-dark"
            href={!isPayment ? loginHref : undefined}
            onClick={handleClick}
            withArrow
          >
            {isPayment ? "Продолжить обучение" : "Оплатить курс"}
          </Button>
        )}

        {(!!infoList && !isChild) && (
          <ul className="course-about__info-list">
            {infoList.map((item) => (
              <li key={item}>
                <Icon name="success-circle" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {isParentLookAtChild && purchase && (
          <div className="course-about__info-parent">
            <p className="course-about__info-parent-badge">
              <span>Куплен:</span>
              <span>{DateHelper.toFormat(new Date(purchase.purchased_at), "dd.MM.yyyy")}</span>
            </p>

            <p className="course-about__info-parent-badge">
              <span>Истекает:</span>
              <span>{DateHelper.toFormat(new Date(purchase.expires_at), "dd.MM.yyyy")}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CourseAbout);
