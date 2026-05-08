"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const HEADER_OFFSET = 120;

type MenuItem = {
  url: string;
  title: string;
};

type Props = {
  menuItems: MenuItem[];
};

const HeaderMenu = ({ menuItems }: Props) => {
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  const [active, setActive] = useState<string>(
    menuItems[0]?.url ?? ""
  );

  const getAnchorId = (url: string) => {
    return url.split("#")[1] ?? "";
  };

  useEffect(() => {
    const handleScroll = () => {
      let currentActive = menuItems[0]?.url ?? "";

      for (const item of menuItems) {
        if (!item.url.includes("#")) continue;

        const id = getAnchorId(item.url);

        const el = document.getElementById(id);

        if (!el) continue;

        const rect = el.getBoundingClientRect();

        if (
          rect.top <= HEADER_OFFSET &&
          rect.bottom >= HEADER_OFFSET
        ) {
          currentActive = item.url;
          break;
        }
      }

      setActive(currentActive);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuItems]);

  return (
    <ul className="header__menu">
      {menuItems.map((item) => {
        const href =
          item.url.startsWith("#") && !isHomePage
            ? `/${item.url}`
            : item.url;

        const isActive =
          active === item.url ||
          active === href;

        return (
          <li
            key={item.url}
            className={`header__menu-item ${
              isActive ? "active" : ""
            }`}
          >
            <a href={href}>
              {item.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default HeaderMenu;
