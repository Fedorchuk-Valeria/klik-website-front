"use client";

import { FC, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { MAP_API_KEY } from "@/src/utils/constant";

import LocationCardContent, { LocationItemData } from "./Card";

import "swiper/css";
import "swiper/css/pagination";

type Props = {
  tag?: string;
  title?: string;
};

const map = `${MAP_API_KEY}`;

const LOCATION_BY_CITY = {
  minsk: [
    {
      image: "https://placehold.co/600x400.png",
      title: "Арэна",
      location: "Пр. Победителей 84, ТЦ Arena City, 2 этаж",
      metro: "Фрунзенская",
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Мip",
      location: "ул. Аэродромная, 125, 4 этаж",
      metro: "",
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Натхненне",
      location: "ул. Максима Богдановича, 132, 2 этаж",
      metro: "",
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Камяніца",
      location: "ул. Неманская, 24, 2 этаж",
      metro: "",
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Навуковая",
      location: "ул. Петра Мстиславца, д.1",
      metro: "",
    },
  ],
  borisov: [
    {
      image: "https://placehold.co/600x400.png",
      title: "Спатканне",
      location: "ул. Строителей 26, ТЦ Клад Наполеона, 328 каб.",
      metro: "",
    },
  ],
  baranovichi: [
    {
      image: "https://placehold.co/600x400.png",
      title: "Паветра",
      location: "ул. Марфицкого и Журавлевича, 1А, 3-й этаж",
      metro: "",
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Усход",
      location: "ул. Тельмана, 64, ТЦ Радужный, 2-й этаж",
      metro: "",
    },
  ],
  novopolotsk: [
    {
      image: "https://placehold.co/600x400.png",
      title: "Iскра",
      location: 'ул. Нефтяников, 6, ТЦ "Зодиак"',
      metro: "",
    },
  ],
} as const satisfies Record<string, LocationItemData[]>;

const Location: FC<Props> = ({ tag, title }) => {
  const [isLocationSlider, setIsLocationSlider] = useState(false);
  const locationPaginationElRef = useRef<HTMLDivElement>(null);

  const onLocationSwiperBeforeInit = (swiper: SwiperType) => {
    const el = locationPaginationElRef.current;
    if (!el) return;
    const pg = swiper.params.pagination;
    const origPg = swiper.originalParams.pagination;
    if (!pg || typeof pg === "boolean" || !origPg || typeof origPg === "boolean") return;
    pg.el = el;
    origPg.el = el;
  };

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const landscapeMaxPx = Number.parseFloat(
      rootStyle.getPropertyValue("--layout-landscape-tablet-max").trim()
    );
    if (!Number.isFinite(landscapeMaxPx)) return;

    const mq = window.matchMedia(`(max-width: ${landscapeMaxPx}px)`);
    const sync = () => setIsLocationSlider(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const handleShowOnMap = () => {};

  return (
    <section className="home-page__block home-page__location">
      <div className="home-page__container">
        <div className="home-page__location-wrapper">
          <div className="home-page__location-top">
            <div className="home-page__tag">{tag}</div>
            <h2 className="home-page__h2 home-page__location-title">{title}</h2>
          </div>

          <div className="home-page__location-body">
            <p className="home-page__location-body--title">Минск</p>

            <div className="home-page__location-body-wrapper">
              {isLocationSlider ? (
                <div className="home-page__location-swiper-stack">
                  <div
                    ref={locationPaginationElRef}
                    className="swiper-pagination home-page__location-swiper-pagination"
                  />

                  <Swiper
                    modules={[Pagination]}
                    rewind
                    grabCursor
                    watchOverflow={false}
                    slidesPerView={1}
                    spaceBetween={10}
                    className="home-page__location-swiper"
                    onBeforeInit={onLocationSwiperBeforeInit}
                    pagination={{
                      el: null,
                      clickable: true,
                      bulletClass: "home-page__location-pagination-bullet",
                      bulletActiveClass: "home-page__location-pagination-bullet--active",
                    }}
                  >
                    {LOCATION_BY_CITY.minsk.map((item, index) => (
                      <SwiperSlide key={`${item.title}-${index}`}>
                        <div className="home-page__location-body-item">
                          <LocationCardContent item={item} onShowOnMap={handleShowOnMap} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <ul className="home-page__location-body-list">
                  {LOCATION_BY_CITY.minsk.map((item, index) => (
                    <li key={`${item.title}-${index}`} className="home-page__location-body-item">
                      <LocationCardContent item={item} onShowOnMap={handleShowOnMap} />
                    </li>
                  ))}
                </ul>
              )}

              <div className="home-page__location-body-map"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
