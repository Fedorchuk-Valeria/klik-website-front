import classNames from "classnames";
import Link from "next/link";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import { Course } from "@/src/entities/common";
import { PAGES } from "@/src/utils/constant";

type FormatsCourseItemProps = {
  item: Course;
};

const FormatsCourseItem = ({ item }: FormatsCourseItemProps) => (
  <li
    className={classNames("children-details-page__formats_list-item", {
      "children-details-page__formats_list-item--disabled": !item.is_active,
    })}
  >
    {item.is_active && (
      <div className="children-details-page__formats_item-status">
        <Icon name="success-circle" />

        <span>Активный</span>
      </div>
    )}

    <div className="children-details-page__formats_item-content">
      <div className="children-details-page__formats_item-content-text">
        <p>{item.title}</p>

        <span>Срок доступа к курсу: {item.date_range}</span>
      </div>

      {item.is_active && (
        <Link
          className="children-details-page__formats_item-content-button"
          href={PAGES.COURSE.replace(":id", item.id.toString())}
        >
          <Button variant="main-green-dark">
            <Icon name="arrow-long" />
          </Button>
        </Link>
      )}
    </div>
  </li>
);

export default FormatsCourseItem;
