'use client';

import Image from "next/image";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay  } from 'swiper/modules';


import Button from "@/src/components/ui/Button/Button";

export default function SwiperSlider(props) {
  const styles: React.CSSProperties = {
        borderRadius: '0px 0px 30px 30px',
    };
  return (
    <Swiper
        style={styles}
        modules={[Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{
            delay: 3500,
            disableOnInteraction: false,
        }}
        loop={true}
        spaceBetween={40}
        slidesPerView={1}
        speed={900}
    >
        {props.homeBanner?.map(banner => (
            <SwiperSlide>
                <h1>{banner?.h1}</h1>
                {props.header ? (
                    <div className="home-page__header-body">
                        {banner?.headerText && (
                        <div className="home-page__header-text">{banner?.headerText}</div>
                        )}
                        {props.header.button?.title && banner?.buttonUrl && (
                        <a
                            href={banner?.buttonUrl}
                            className="home-page__header-button-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button className="home-page__header-button" withArrow={true}>
                                {props.header.button?.title}
                            </Button>
                        </a>
                        )}
                    </div>
                ) : null}
                <div className="home-page__header-img">
                    <div className="home-page__header-img-layer home-page__header-img-layer--desktop">
                        <Image src={banner?.imageDesktop} alt={props.page.seo.h1} fill />
                    </div>
                    <div className="home-page__header-img-layer home-page__header-img-layer--tablet">
                        <Image src={banner?.imageTablet} alt={props.page.seo.h1} fill />
                    </div>
                </div>
            </SwiperSlide>
        ))}
    </Swiper>
  );
}