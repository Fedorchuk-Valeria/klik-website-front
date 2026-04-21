import LogoSvg from '@/src/assets/images/logo.svg';
import FooterSticker from '@/src/assets/images/footer_sticker.svg';

import Socials from "@/src/components/ui/Socials/Socials";
import FooterBlock from "@/src/components/ui/Footer/FooterBlock";
import {City, getCities} from "@/src/lib/getCities";
import {MenuItem} from "@/src/lib/content/types";

type FooterInfo = {
    title: string;
    icon: string;
    text?: string;
    list?: City[];
};

type FooterWidget = {
    title: string;
    links?: MenuItem[];
};

export default function Footer() {

    const footerLinks: MenuItem[] = [
        {
            url: '#',
            title: 'Политика обработки файлов cookies',
        },
        {
            url: '#',
            title: 'Политика конфиденциальности',
        },
        {
            url: '#',
            title: 'Пользовательское соглашение',
        }
    ];

    const footerInfo: FooterInfo[] = [
        {
            title: 'Главный офис',
            text: 'г. Москва, ул. Тверская, д. 15',
            icon: 'pin',
        },
        {
            title: 'Телефон',
            text: '<a href="tel:+375296332779">+375 (29) 633-27-79</a>',
            icon: 'call',
        },
        {
            title: 'Email',
            text: '<a href="mailto:info@itschool.ru">info@itschool.ru</a>',
            icon: 'mail',
        }
    ];

    const footerCities: FooterInfo = {
        title: 'Наши города',
        icon: 'world',
        list: getCities(),
    };

    const footerWidgets: FooterWidget[] = [
        {
            title: 'О школе',
            links: [
                {
                    title: 'О нас',
                    url: '#'
                },
                {
                    title: 'Наши тьюторы',
                    url: '#'
                },
                {
                    title: 'Отзывы',
                    url: '#'
                }
            ],
        },
        {
            title: 'Обучение',
            links: [
                {
                    title: 'Форматы обучения',
                    url: '#'
                },
                {
                    title: 'Чему обучаем',
                    url: '#'
                },
                {
                    title: 'Программы обучения',
                    url: '#'
                }
            ],
        },
        {
            title: 'Направления',
            links: [
                {
                    title: 'Программирование',
                    url: '#'
                },
                {
                    title: '3D-моделирование',
                    url: '#'
                },
                {
                    title: 'Дизайн',
                    url: '#'
                }
            ],
        },
        {
            title: 'Помощь',
            links: [
                {
                    title: 'FAQ',
                    url: '#'
                }
            ],
        }
    ];

    return (
        <footer className='footer'>
            <div className="footer__sticker">
                <FooterSticker />
            </div>
            <div className="footer__container">
                <div className="footer__body">
                    <div className="footer__top footer__body-row">
                        <div className="footer__brand">
                            <div className="footer__logo">
                                <LogoSvg />
                            </div>
                            <div className="footer__logo-text">KLiK — дополнительное IT-образование детей 6–16 лет</div>
                        </div>
                        <div className="footer__info">
                            <div className="footer__row">
                                {footerInfo.map((item, index) => (
                                    <FooterBlock item={item} key={index} />
                                ))}
                            </div>
                            <FooterBlock item={footerCities} />
                        </div>
                    </div>
                    <div className="footer__middle footer__body-row">
                        <div className="footer__socials">
                            <Socials />
                        </div>
                        {footerWidgets?.length > 0 && (
                            <div className="footer__widgets">
                                {footerWidgets.map((widget, index) => (
                                    <div key={index} className="footer__widget">
                                        <div className="footer__widget-title">
                                            {widget.title}
                                        </div>
                                        <ul className="footer__widget-list">
                                            {widget.links?.map((link, linkIndex) => (
                                                <li key={linkIndex}>
                                                    <a href={link.url}>{link.title}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="footer__bottom">
                    <div className="footer__bottom-wrapper">
                        <div className="footer__bottom-copyright">© 2026 IT Школа. Все права защищены.</div>
                        <ul className="footer__links">
                            {footerLinks.map((item, index) => (
                                <li className="footer__links-item" key={index}>
                                    {item.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}