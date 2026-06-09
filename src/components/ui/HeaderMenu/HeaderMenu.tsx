"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import HomeAnchorLink, {
  getAnchorIdFromHref,
} from "@/src/components/ui/HomeAnchorLink/HomeAnchorLink";
import { HEADER_ANCHOR_OFFSET_PX, SET_ACTIVE_ANCHOR_EVENT } from "@/src/utils/constant";

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

  const [active, setActive] = useState<string>(menuItems[0]?.url ?? "");

  const getAnchorId = getAnchorIdFromHref;

  useEffect(() => {
    const handleScroll = () => {
      if (!isHomePage) {
        setActive(menuItems[0]?.url ?? "");
        return;
      }

      let currentActive = menuItems[0]?.url ?? "";
      const line = HEADER_ANCHOR_OFFSET_PX + 4;

      for (const item of menuItems) {
        if (!item.url.includes("#")) continue;

        const id = getAnchorId(item.url);

        const el = document.getElementById(id);

        if (!el) continue;

        const rect = el.getBoundingClientRect();

        if (rect.top <= line) {
          currentActive = item.url;
        }
      }

      setActive(currentActive);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuItems, isHomePage]);

  useEffect(() => {
    const onAnchorNav = (e: Event) => {
      const ce = e as CustomEvent<{ id?: string }>;
      const id = ce.detail?.id;
      if (!id) return;

      const match = menuItems.find((item) => getAnchorId(item.url) === id);
      if (match) setActive(match.url);
    };

    window.addEventListener(SET_ACTIVE_ANCHOR_EVENT, onAnchorNav as EventListener);

    return () => {
      window.removeEventListener(SET_ACTIVE_ANCHOR_EVENT, onAnchorNav as EventListener);
    };
  }, [menuItems]);

  return (
    <ul className="header__menu">
      {menuItems.map((item) => {
        const isActive = active === item.url || active === `#${getAnchorId(item.url)}`;

        return (
          <li key={item.url} className={`header__menu-item ${isActive ? "active" : ""}`}>
            <HomeAnchorLink anchor={getAnchorId(item.url)}>{item.title}</HomeAnchorLink>
          </li>
        );
      })}
    </ul>
  );
};

export default HeaderMenu;
