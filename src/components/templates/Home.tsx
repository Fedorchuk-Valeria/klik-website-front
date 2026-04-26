import {Page} from "@/src/lib/content/types";
import Image from 'next/image';
import headerImg from '@/src/assets/images/templates/homepage/header.png';
import Button from "@/src/components/ui/Button/Button";
import FAQ from "@/src/components/ui/Faq/Faq";
import FormatsList from "@/src/components/template-parts/FormatsList/FormatsList";

type Props = {
    page: Page;
};
export default function Home({ page }: Props) {

    const header = page?.content?.header;
    const faq = page?.content?.faq;
    const formats = page?.content?.formats;

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
            <section className='home-page__block home-page__formats' id='formats'>
                <div className="home-page__container">
                    <div className="home-page__formats-wrapper">
                        {formats?.tag && <div className="home-page__tag">{formats.tag}</div>}
                        <div className="home-page__formats-top">
                            {formats?.title && <h2 className="home-page__h2 home-page__formats-title">{formats.title}</h2>}
                            {formats?.text && <div className="home-page__formats-text">{formats.text}</div>}
                        </div>
                        <div className="home-page__formats-body">
                            <FormatsList items={formats.items} />
                        </div>
                    </div>
                </div>
            </section>
            {faq ?
            <section className='home-page__block home-page__faq' id='faq'>
                <div className="home-page__container">
                    <div className="home-page__faq-wrapper">
                        <div className="home-page__faq-left">
                            <div className="home-page__faq-top">
                                {faq?.tag && <div className="home-page__tag">{faq.tag}</div>}
                                {faq?.title && <h2 className="home-page__h2 home-page__faq-title">{faq.title}</h2>}
                                {faq?.text && <div className="home-page__faq-text">{faq.text}</div>}
                            </div>
                            <div className="home-page__faq-bottom">
                                <div className="home-page__faq-bottom_body">
                                    {faq?.footer?.title && <div className="home-page__faq-bottom_title">{faq.footer.title}</div>}
                                    {faq?.footer?.text && <div className="home-page__faq-bottom_text">{faq.footer.text}</div>}
                                    {faq?.footer?.button?.title && faq?.footer?.button?.url && <Button className='home-page__faq-bottom_btn' withArrow={true}>{faq.footer.button.title}</Button>}
                                </div>
                            </div>
                        </div>
                        {faq?.items &&
                            <div className="home-page__faq-right">
                                <FAQ items={faq.items} />
                            </div>
                        }
                    </div>
                </div>
            </section> : null}
        </main>
    );
}