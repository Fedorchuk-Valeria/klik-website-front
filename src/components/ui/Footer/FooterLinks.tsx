"use client";

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

  const handleLinkClick = (action?: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (action) {
      event.preventDefault();
      event.stopPropagation();

      if (action === "openCities") {
        dispatch(showModal({ modalType: ModalType.PLACE_SELECT }));
      }
    }
  };

  return (
    <li>
      <a href={link?.url} onClick={handleLinkClick(link?.action)}>
        {link?.title}
      </a>
    </li>
  );
};

export default FooterLinks;
