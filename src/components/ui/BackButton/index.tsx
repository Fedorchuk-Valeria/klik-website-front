import Link from "next/link";
import { FC, memo } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import classNames from "classnames";

type BackButtonProps = {
  label: string;
  className?: string;
  url: string;
};

const BackButton: FC<BackButtonProps> = ({ label, className, url }) => {
  return (
    <Link href={url} className={classNames("back-button", className)}>
      <Icon name="arrow" />
      <span>{label}</span>
    </Link>
  );
};

export default memo(BackButton);
