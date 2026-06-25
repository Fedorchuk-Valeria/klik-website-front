"use client";

import HomeAnchorLink, {
  getAnchorIdFromHref,
} from "@/src/components/ui/HomeAnchorLink/HomeAnchorLink";

type MenuItem = {
  url: string;
  title: string;
};

type Props = {
  menuItems: MenuItem[];
  onClose?: () => void;
};

const HeaderMobileList = ({ menuItems, onClose }: Props) => {
  return (
    <ul className="header__mobile-menu">
      {menuItems.map((item) => (
        <li key={item.url}>
          <HomeAnchorLink anchor={getAnchorIdFromHref(item.url)} onClick={onClose}>
            {item.title}
          </HomeAnchorLink>
        </li>
      ))}
    </ul>
  );
};

export default HeaderMobileList;
