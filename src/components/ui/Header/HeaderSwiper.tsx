'use client';

import Image, { type StaticImageData } from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import Button from "@/src/components/ui/Button/Button";

interface SwiperSliderProps {
  homeBanner?: {
    h1: string;
    headerText: string;
    buttonUrl: string;
    imageDesktop: StaticImageData;
    imageTablet: StaticImageData;
  }[];
  header?: {
    button?: {
      title?: string;
    };
  };
  page: {
    seo: {
      h1: string;
    };
  };
}

export default function SwiperSlider({ homeBanner, header, page }: SwiperSliderProps) {
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
      loop
      spaceBetween={40}
      slidesPerView={1}
      speed={900}
    >
      {homeBanner?.map((banner, index) => (
        <SwiperSlide key={index}>
          <h1>{banner.h1}</h1>

          {header && (
            <div className="home-page__header-body">
              {banner.headerText && (
                <div className="home-page__header-text">
                  {banner.headerText}
                </div>
              )}

              {header.button?.title && banner.buttonUrl && (
                <a
                  href={banner.buttonUrl}
                  className="home-page__header-button-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="home-page__header-button"
                    withArrow
                  >
                    {header.button.title}
                  </Button>
                </a>
              )}
            </div>
          )}

          <div className="home-page__header-img">
            <div className="home-page__header-img-layer home-page__header-img-layer--desktop">
              <Image
                src={banner.imageDesktop}
                alt={page.seo.h1}
                fill
              />
            </div>

            <div className="home-page__header-img-layer home-page__header-img-layer--tablet">
              <Image
                src={banner.imageTablet}
                alt={page.seo.h1}
                fill
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}