"use client";

import { usePathname } from "next/navigation";

type MenuItem = {
  url: string;
  title: string;
};

type Props = {
  menuItems: MenuItem[];
  onClose?: () => void;
};

const HeaderMobileList = ({ menuItems, onClose}: Props) => {
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  return (
    <ul className="header__mobile-menu">
      {menuItems.map((item) => {
        const href =
          item.url.startsWith("#") && !isHomePage
            ? `/${item.url}`
            : item.url;

        return (
          <li key={item.url}>
            <a href={href} onClick={onClose}>
              {item.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default HeaderMobileList;
