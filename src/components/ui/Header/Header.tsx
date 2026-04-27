import LogoSvg from "@/src/assets/images/logo.svg";
import Socials from "@/src/components/ui/Socials/Socials";
import {MenuItem} from "@/src/lib/content/types";
import HeaderMenu from "@/src/components/ui/HeaderMenu/HeaderMenu";
import CitySwitcher from "@/src/components/ui/CitySwitcher/CitySwitcher";
import {getCities} from "@/src/lib/getCities";
import {headers} from "next/headers";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

export default async function Header() {
    const cities = await getCities();

    const headersList = await headers();
    const slug = headersList.get('x-city');

    const currentCity =
        cities.find(city => city.slug === slug) || cities[0];

    console.log('slug=', slug);
    console.log('currentCity=', currentCity);

    const headerMenu: MenuItem[] = [
        {
            url: '',
            title: 'О Школе',
        },
        {
            url: '#programms',
            title: 'Программы',
        },
        {
            url: '#location',
            title: 'Локации',
        },
        {
            url: '#reviews',
            title: 'Отзывы',
        },
        {
            url: '#faq',
            title: 'FAQ',
        }
    ];

    return (
        <header className='header'>
           <div className="header__container">
               <div className="header__wrapper">
                   <div className="header__top header__row">
                       <div className="header__left">
                           <div className="header__brand">
                               <div className="header__logo">
                                   <LogoSvg />
                               </div>
                               <div className="header__logo-text">Дополнительное
                                   <br />IT-образование для детей</div>
                           </div>
                           <div className="header__city">
                               <CitySwitcher cities={cities} currentCity={currentCity} />
                           </div>
                       </div>
                       <div className="header__right">
                           <div className="header__socials">
                               <Socials />
                           </div>
                           <div className="header__cabinet">
                               <Button className='header__cabinet-button'>
                                   <Icon className='header__cabinet-icon' name='user' />
                                   Личный кабинет
                               </Button>
                           </div>
                       </div>
                   </div>
                   <div className="header__bottom header__row">
                       <div className="header__left">
                           <HeaderMenu items={headerMenu} />
                       </div>
                       <div className="header__right">
                           <a className="header__phone" href='tel:+37529633279'>
                               +375 (29) 633-27-79
                           </a>
                           <Button className='header__call' variant='main-light'>Записаться</Button>
                       </div>
                   </div>
               </div>
           </div>
        </header>
    );
}