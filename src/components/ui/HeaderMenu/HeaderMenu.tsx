'use client';

import { useEffect, useRef, useState } from 'react';
import { MenuItem } from '@/src/lib/content/types';

type HeaderMenuProps = {
    items: MenuItem[];
};

const HEADER_OFFSET = 120;

const HeaderMenu = ({ items }: HeaderMenuProps) => {
    const [active, setActive] = useState<string>(items[0]?.url ?? '');
    const isClickScrolling = useRef(false);

    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        url: string
    ) => {
        e.preventDefault();

        isClickScrolling.current = true;

        const id = url.replace('#', '');
        const el = document.getElementById(id);

        if (el) {
            const top =
                el.getBoundingClientRect().top +
                window.scrollY -
                HEADER_OFFSET;

            window.scrollTo({
                top,
                behavior: 'smooth',
            });
        }

        window.history.pushState(null, '', url);
        setActive(url);

        setTimeout(() => {
            isClickScrolling.current = false;
        }, 700);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isClickScrolling.current) return;

            let currentActive = items[0]?.url ?? '';

            for (const item of items) {
                const id = item.url.replace('#', '');
                const el = document.getElementById(id);

                if (!el) continue;

                const rect = el.getBoundingClientRect();

                if (rect.top <= HEADER_OFFSET && rect.bottom >= HEADER_OFFSET) {
                    currentActive = item.url;
                    break;
                }
            }

            setActive(currentActive);
        };

        window.addEventListener('scroll', handleScroll);

        handleScroll();

        if (window.location.hash) {
            const exists = items.some(i => i.url === window.location.hash);
            if (exists) {
                setActive(window.location.hash);
            }
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [items]);

    return (
        <ul className="header__menu">
            {items.map(item => (
                <li
                    key={item.url}
                    className={`header__menu-item ${
                        active === item.url ? 'active' : ''
                    }`}
                >
                    <a href={item.url} onClick={e => handleClick(e, item.url)}>
                        {item.title}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default HeaderMenu;