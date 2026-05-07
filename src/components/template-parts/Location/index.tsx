"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Icon from "@/src/components/ui/Icon/Icon";

import { MAP_API_KEY } from "@/src/utils/constant";
import { loadYandexMaps } from "@/src/utils/loadYandexMaps";

import LocationCardContent, { LocationItemData } from "./Card";
import { YANDEX_MAP_PIN_ICON } from "./yandexPinIcon";

import "swiper/css";
import "swiper/css/pagination";

type Props = {
  tag?: string;
  title?: string;
};

type YMapInstance = {
  destroy: () => void;
  setCenter: (center: number[], zoom?: number, options?: { duration?: number }) => void;
  geoObjects: {
    add: (object: unknown) => void;
    getBounds: () => number[][] | null;
  };
};

const LOCATION_BY_CITY = {
  minsk: [
    {
      image: "https://placehold.co/600x400.png",
      title: "Арэна",
      location: "Пр. Победителей 84, ТЦ Arena City, 2 этаж",
      metro: "Фрунзенская",
      coords: [53.930781, 27.499905] as const,
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Мip",
      location: "ул. Аэродромная, 125, 4 этаж",
      metro: "",
      coords: [53.8711, 27.6876] as const,
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Натхненне",
      location: "ул. Максима Богдановича, 132, 2 этаж",
      metro: "",
      coords: [53.9191, 27.5685] as const,
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Камяніца",
      location: "ул. Неманская, 24, 2 этаж",
      metro: "",
      coords: [53.9048, 27.5373] as const,
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Навуковая",
      location: "ул. Петра Мстиславца, д.1",
      metro: "",
      coords: [53.9341, 27.6513] as const,
    },
  ],
  borisov: [
    {
      image: "https://placehold.co/600x400.png",
      title: "Спатканне",
      location: "ул. Строителей 26, ТЦ Клад Наполеона, 328 каб.",
      metro: "",
      coords: [54.2239, 28.5118] as const,
    },
  ],
  baranovichi: [
    {
      image: "https://placehold.co/600x400.png",
      title: "Паветра",
      location: "ул. Марфицкого и Журавлевича, 1А, 3-й этаж",
      metro: "",
      coords: [53.1322, 26.0175] as const,
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Усход",
      location: "ул. Тельмана, 64, ТЦ Радужный, 2-й этаж",
      metro: "",
      coords: [53.1169, 26.043] as const,
    },
  ],
  novopolotsk: [
    {
      image: "https://placehold.co/600x400.png",
      title: "Iскра",
      location: 'ул. Нефтяников, 6, ТЦ "Зодиак"',
      metro: "",
      coords: [55.531, 28.648] as const,
    },
  ],
} as const satisfies Record<string, LocationItemData[]>;

// TODO добавить автовыбор города из хоста
// TODO зум 16 при клике
// TODO автопереключение слайдов раз в 5 сек
// TODO при тапе пауза 10 сек
const Location: FC<Props> = ({ tag, title }) => {
  const [isLocationSlider, setIsLocationSlider] = useState(false);
  const locationPaginationElRef = useRef<HTMLDivElement>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<YMapInstance | null>(null);

  const locations = LOCATION_BY_CITY.minsk;

  const focusOnCoords = useCallback((coords: readonly [number, number]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setCenter([coords[0], coords[1]], 16, { duration: 300 });
  }, []);

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

  useEffect(() => {
    const apiKey = MAP_API_KEY;
    if (!apiKey) return;

    let cancelled = false;
    const items = LOCATION_BY_CITY.minsk;

    const run = async () => {
      try {
        await loadYandexMaps(apiKey);
      } catch {
        return;
      }
      if (cancelled || !mapContainerRef.current || !window.ymaps) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- типы из JS API 2.1 не подключены
      const ymaps = window.ymaps as any;

      ymaps.ready(() => {
        if (cancelled || !mapContainerRef.current) return;

        const map: YMapInstance = new ymaps.Map(
          mapContainerRef.current,
          {
            center: [items[0].coords[0], items[0].coords[1]],
            zoom: 11,
            controls: ["zoomControl"],
          },
          {
            suppressMapOpenBlock: true,
            suppressObsoleteBrowserNotifier: true,
          }
        );

        mapInstanceRef.current = map;

        items.forEach((item) => {
          const placemark = new ymaps.Placemark(
            [item.coords[0], item.coords[1]],
            {
              balloonContentHeader: item.title,
              balloonContentBody: item.location,
            },
            { ...YANDEX_MAP_PIN_ICON }
          );
          placemark.events.add("click", () => {
            map.setCenter([item.coords[0], item.coords[1]], 16, { duration: 300 });
          });
          map.geoObjects.add(placemark);
        });

        const bounds = map.geoObjects.getBounds();
        if (bounds) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- setBounds в типах карты не объявлен
          (map as any).setBounds(bounds, { checkZoomRange: true, zoomMargin: 48 });
        }
      });
    };

    void run();

    return () => {
      cancelled = true;
      mapInstanceRef.current?.destroy();
      mapInstanceRef.current = null;
    };
  }, []);

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
                    {locations.map((item, index) => (
                      <SwiperSlide key={`${item.title}-${index}`}>
                        <div className="home-page__location-body-item">
                          <LocationCardContent item={item} onShowOnMap={focusOnCoords} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <ul className="home-page__location-body-list">
                  {locations.map((item, index) => (
                    <li key={`${item.title}-${index}`} className="home-page__location-body-item">
                      <LocationCardContent item={item} onShowOnMap={focusOnCoords} />
                    </li>
                  ))}
                </ul>
              )}

              <div className="home-page__location-map-column">
                <p className="home-page__location-map--hint">
                  <span className="home-page__location-map--hint-icon">
                    <Icon name="lamp" />
                  </span>

                  <span className="home-page__location-map--hint-text">
                    <span>Интерактивная карта:</span>{" "}
                    <span>Кликните на любую локацию, чтобы увидеть её на Яндекс.Картах</span>
                  </span>
                </p>
                {!MAP_API_KEY ? (
                  <div className="home-page__location-body-map home-page__location-body-map--placeholder">
                    Укажите NEXT_PUBLIC_YANDEX_API_KEY для отображения карты
                  </div>
                ) : (
                  <div ref={mapContainerRef} className="home-page__location-body-map" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
