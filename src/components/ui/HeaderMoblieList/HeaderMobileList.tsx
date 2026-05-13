"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PENDING_HOME_ANCHOR_KEY } from "@/src/utils/constant";

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

  const getAnchorId = (url: string) => url.split("#")[1] ?? "";

  return (
    <ul className="header__mobile-menu">
      {menuItems.map((item) => {
        const href =
          item.url.startsWith("#") && !isHomePage
            ? `/${item.url}`
            : item.url;

        return (
          <li key={item.url}>
            {isHomePage ? (
              <a href={href} onClick={onClose}>
                {item.title}
              </a>
            ) : (
              <Link
                href="/"
                scroll={false}
                onClick={() => {
                  const id = getAnchorId(item.url);
                  if (id) {
                    sessionStorage.setItem(PENDING_HOME_ANCHOR_KEY, id);
                  }
                  onClose?.();
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

export default HeaderMobileList;
