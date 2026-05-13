import classNames from "classnames";
import Link from "next/link";

import Icon from "@/src/components/ui/Icon/Icon";

export type BreadcrumbProps = {
  currentLabel: string;
  homeLabel?: string;
  className?: string;
};

export default function Breadcrumb({
  currentLabel,
  homeLabel = "Главная",
  className,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Хлебные крошки" className={classNames("breadcrumb", className)}>
      <ol className="breadcrumb__list">
        <li className="breadcrumb__item">
          <Link className="breadcrumb__link" href="/">
            {homeLabel}
          </Link>
        </li>

        <li className="breadcrumb__separator" aria-hidden="true">
          <Icon name="arrow" />
        </li>

        <li className="breadcrumb__item" aria-current="page">
          <span className="breadcrumb__current">{currentLabel}</span>
        </li>
      </ol>
    </nav>
  );
}
