"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {PAGE_ANCHORS} from "@/src/utils/constant";

const HEADER_OFFSET = 120;

const menuItems = [
    {
        url: `#${PAGE_ANCHORS.ABOUT}`,
        title: "О Школе",
    },
    {
        url: `#${PAGE_ANCHORS.PROGRAMS}`,
        title: "Программы",
    },
    {
        url: `#${PAGE_ANCHORS.LOCATION}`,
        title: "Локации",
    },
    {
        url: `#${PAGE_ANCHORS.REVIEWS}`,
        title: "Отзывы",
    },
    {
        url: `#${PAGE_ANCHORS.FAQ}`,
        title: "FAQ",
    },
];

const HeaderMenu = () => {
    const router = useRouter();
    const pathname = usePathname();

    const isHomePage = pathname === "/";

    const [active, setActive] = useState<string>(
        menuItems[0]?.url ?? ""
    );

    const isClickScrolling = useRef(false);

    const getAnchorId = (url: string) => {
        return url.split("#")[1] ?? "";
    };

    const scrollToAnchor = (url: string) => {
        const id = getAnchorId(url);

        if (!id) return;

        const el = document.getElementById(id);

        if (!el) return;

        const top =
            el.getBoundingClientRect().top +
            window.scrollY -
            HEADER_OFFSET;

        window.scrollTo({
            top,
            behavior: "smooth",
        });
    };

    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        url: string
    ) => {
        e.preventDefault();

        if (!url.includes("#")) {
            router.push(url);
            return;
        }

        if (!isHomePage) {
            router.push(`/${url}`);
            return;
        }

        isClickScrolling.current = true;

        scrollToAnchor(url);

        window.history.pushState(null, "", url);

        setActive(url);

        setTimeout(() => {
            isClickScrolling.current = false;
        }, 700);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isClickScrolling.current) return;

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
    }, []);


    useEffect(() => {
        if (!window.location.hash) return;

        const hash = window.location.hash;

        const exists = menuItems.some((item) => {
            return getAnchorId(item.url) === hash.replace("#", "");
        });

        if (!exists) return;

        setActive(hash);

        const timeout = setTimeout(() => {
            scrollToAnchor(hash);
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

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
                        <a
                            href={href}
                            onClick={(e) => handleClick(e, item.url)}
                        >
                            {item.title}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
};

export default HeaderMenu;
