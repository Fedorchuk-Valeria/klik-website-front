"use client";

import HomeAnchorLink, {
  getAnchorIdFromHref,
} from "@/src/components/ui/HomeAnchorLink/HomeAnchorLink";
import { ModalType } from "@/src/entities/common";
import { MenuItem } from "@/src/lib/content/types";
import { useAppDispatch } from "@/src/store/hooks";
import { showModal } from "@/src/store/slices/modalSlice";
import { FC } from "react";

type PropTypes = {
  link: MenuItem;
};

const FooterLinks: FC<PropTypes> = ({ link }) => {
  const dispatch = useAppDispatch();
  const anchorId = link?.url ? getAnchorIdFromHref(link.url) : "";

  const handleActionClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (link?.action === "openCities") {
      dispatch(showModal({ modalType: ModalType.PLACE_SELECT }));
    }
  };

  if (link?.action) {
    return (
      <li>
        <a href={link.url ?? "#"} onClick={handleActionClick}>
          {link.title}
        </a>
      </li>
    );
  }

  if (anchorId) {
    return (
      <li>
        <HomeAnchorLink anchor={anchorId}>{link?.title}</HomeAnchorLink>
      </li>
    );
  }

  return (
    <li>
      <a href={link?.url}>{link?.title}</a>
    </li>
  );
};

export default FooterLinks;
