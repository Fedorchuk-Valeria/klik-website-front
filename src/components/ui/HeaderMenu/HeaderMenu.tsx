"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  HEADER_ANCHOR_OFFSET_PX,
  PENDING_HOME_ANCHOR_KEY,
  SET_ACTIVE_ANCHOR_EVENT,
} from "@/src/utils/constant";

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
            {isHomePage ? (
              <a href={href}>{item.title}</a>
            ) : (
              <Link
                href="/"
                scroll={false}
                onClick={() => {
                  const id = getAnchorId(item.url);
                  if (id) {
                    sessionStorage.setItem(PENDING_HOME_ANCHOR_KEY, id);
                  }
                }}
              >
                {item.title}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default HeaderMenu;
