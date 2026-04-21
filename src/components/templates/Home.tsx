import {Page} from "@/src/lib/content/types";
import Image from 'next/image';
import headerImg from '@/src/assets/images/templates/homepage/header.png';
import Button from "@/src/components/ui/Button/Button";

type Props = {
    page: Page;
};
export default function Home({ page }: Props) {

    const header = page?.content?.header;

    return (
        <main className='main home-page'>
            <section className="home-page__header">
                <div className="header__container">
                    <div className="home-page__header-wrapper">
                        <h1>{page.seo.h1}</h1>
                        {header ? <div className='home-page__header-body'>
                            {header?.text && <div className="home-page__header-text">{header?.text}</div>}
                            {header.button?.title && header.button?.url && <Button className='home-page__header-button' withArrow={true}>{header.button?.title}</Button>}
                        </div>: null}
                        <Image
                            className='home-page__header-img'
                            src={headerImg}
                            alt={page.seo.h1}
                        />
                    </div>
                </div>
            </section>

            <section style={{ padding: '150px 0' }} id='about'>
                <div className="container">
                    <h2>О школе</h2>
                </div>
            </section>
            <section style={{ padding: '150px 0' }} id='programms'>
                <div className="container">
                    <h2>Программ</h2>
                </div>
            </section>
            <section style={{ padding: '150px 0' }} id='location'>
                <div className="container">
                    <h2>Локации</h2>
                </div>
            </section>
            <section style={{ padding: '150px 0' }} id='reviews'>
                <div className="container">
                    <h2>Отзывы</h2>
                </div>
            </section>
            <section style={{ padding: '150px 0' }} id='faq'>
                <div className="container">
                    <h2>Нас часто спрашивают</h2>
                </div>
            </section>
        </main>
    );
}