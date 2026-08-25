"use client";

import { FC, startTransition, useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Icon from "@/src/components/ui/Icon/Icon";

import LocationColas from "@/src/assets/images/templates/homepage/locations/colas.png";
import LocationEmotion from "@/src/assets/images/templates/homepage/locations/emotion.svg";
import LocationFoot from "@/src/assets/images/templates/homepage/locations/foot.svg";
import LocationHockey from "@/src/assets/images/templates/homepage/locations/hockey.svg";
import LocationMir from "@/src/assets/images/templates/homepage/locations/mir.svg";
import LocationScience from "@/src/assets/images/templates/homepage/locations/science.svg";
import LocationSoviet from "@/src/assets/images/templates/homepage/locations/soviet.png";
import LocationStar from "@/src/assets/images/templates/homepage/locations/star.svg";
import LocationStone from "@/src/assets/images/templates/homepage/locations/stone.svg";
import LocationSunrise from "@/src/assets/images/templates/homepage/locations/sunrise.svg";
import LocationWind from "@/src/assets/images/templates/homepage/locations/wind.svg";

import { getCitySlugFromHost, type ItKlikCitySlug } from "@/src/utils/cityFromHost";
import { CITY_DISPLAY_NAME, MAP_API_KEY } from "@/src/utils/constant";
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
  getZoom: () => number;
  setZoom: (zoom: number, options?: { duration?: number }) => void;
  container?: {
    fitToViewport?: () => void;
  };
  geoObjects: {
    add: (object: unknown) => void;
    getBounds: () => number[][] | null;
  };
};

const LOCATION_BY_CITY = {
  minsk: [
    {
      image: "",
      title: "Арэна",
      location: "Пр. Победителей 84, ТЦ Arena City, 2 этаж",
      metro: "Фрунзенская",
      coords: [53.937997, 27.487524],
      icon: <LocationHockey />,
      iconPlacement: "top",
    },
    {
      image: "",
      title: "Мip",
      location: "ул. Аэродромная, 125, 4 этаж",
      metro: "Аэродромная",
      coords: [53.873341, 27.55857],
      icon: <LocationMir />,
    },
    {
      image: "",
      title: "Натхненне",
      location: "ул. Максима Богдановича, 132, 2 этаж",
      metro: "Академия наук",
      coords: [53.937833, 27.584361],
      icon: <LocationEmotion />,
    },
    {
      image: "",
      title: "Камянiца",
      location: "ул. Неманская, 24, 2 этаж",
      metro: "Каменная горка",
      coords: [53.911301, 27.431036],
      icon: <LocationStone />,
    },
    {
      image: "",
      title: "Навуковая",
      location: "ул. Петра Мстиславца, д.1",
      metro: "Восток",
      coords: [53.928535, 27.654304],
      icon: <LocationScience />,
    },
    {
      image: LocationColas.src,
      title: "Колас",
      location: "ул. Веры Хоружей, 4, 3 этаж",
      metro: "Якуба Коласа",
      coords: [53.917782, 27.58128],
      icon: <LocationScience />,
    },
  ],
  borisov: [
    {
      image: "",
      title: "Спатканне",
      location: "ул. Строителей 26, ТЦ Клад Наполеона, 328 каб.",
      metro: "",
      coords: [54.208212, 28.490276],
      icon: <LocationFoot />,
    },
  ],
  baranovichi: [
    {
      image: "",
      title: "Паветра",
      location: "ул. Марфицкого и Журавлевича, 1А, 3-й этаж",
      metro: "",
      coords: [53.107054, 26.000308],
      icon: <LocationWind />,
    },
    {
      image: "",
      title: "Усход",
      location: "ул. Тельмана, 64, ТЦ Радужный, 2-й этаж",
      metro: "",
      coords: [53.131866, 26.056075],
      icon: <LocationSunrise />,
    },
    {
      image: LocationSoviet.src,
      title: "Савецкая",
      location: "ул. Советская, 59, 2 этаж",
      metro: "",
      coords: [53.134437, 26.01513],
      icon: <LocationSunrise />,
    },
  ],
  novopolotsk: [
    {
      image: "",
      title: "Iскра",
      location: 'ул. Нефтяников, 6, ТЦ "Зодиак"',
      metro: "",
      coords: [55.513135, 28.682429],
      icon: <LocationStar />,
    },
  ],
} as const satisfies Record<string, LocationItemData[]>;

const LOCATION_AUTOPLAY_DELAY_MS = 5_000;
const LOCATION_IDLE_RESUME_MS = 10_000;
const LOCATION_MAP_MAX_ZOOM = 16;

const Location: FC<Props> = ({ tag, title }) => {
  const [isLocationSlider, setIsLocationSlider] = useState(false);
  const [citySlug, setCitySlug] = useState<ItKlikCitySlug>("minsk");
  const locationPaginationElRef = useRef<HTMLDivElement>(null);
  const locationSliderViewportRef = useRef<HTMLDivElement>(null);

  const swiperRef = useRef<SwiperType | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const inViewportRef = useRef(false);
  const slideCountRef = useRef(0);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<YMapInstance | null>(null);

  const locations = LOCATION_BY_CITY[citySlug];
  const locationSlideCount = locations.length;

  const clearLocationAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const clearLocationResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const scheduleLocationAutoplayStep = useCallback(() => {
    clearLocationAutoplayTimer();

    if (!inViewportRef.current || pausedRef.current) return;
    if (slideCountRef.current <= 1) return;

    const tick = () => {
      autoplayTimerRef.current = null;
      if (pausedRef.current) return;
      if (!inViewportRef.current) return;
      if (slideCountRef.current <= 1) return;

      const sw = swiperRef.current;
      if (!sw || sw.destroyed) return;

      sw.slideNext();
      autoplayTimerRef.current = setTimeout(tick, LOCATION_AUTOPLAY_DELAY_MS);
    };

    autoplayTimerRef.current = setTimeout(tick, LOCATION_AUTOPLAY_DELAY_MS);
  }, [clearLocationAutoplayTimer]);

  const onLocationSliderUserInteraction = useCallback(() => {
    if (slideCountRef.current <= 1) return;

    pausedRef.current = true;

    clearLocationAutoplayTimer();
    clearLocationResumeTimer();

    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      pausedRef.current = false;
      scheduleLocationAutoplayStep();
    }, LOCATION_IDLE_RESUME_MS);
  }, [clearLocationAutoplayTimer, clearLocationResumeTimer, scheduleLocationAutoplayStep]);

  const onLocationSwiperMount = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      if (
        isLocationSlider &&
        inViewportRef.current &&
        !pausedRef.current &&
        slideCountRef.current > 1
      ) {
        scheduleLocationAutoplayStep();
      }
    },
    [isLocationSlider, scheduleLocationAutoplayStep]
  );

  const focusOnCoords = useCallback((coords: readonly [number, number]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setCenter([coords[0], coords[1]], LOCATION_MAP_MAX_ZOOM, { duration: 300 });
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
    const slug = getCitySlugFromHost(window.location.hostname);
    startTransition(() => {
      setCitySlug(slug);
    });
  }, []);

  useEffect(() => {
    slideCountRef.current = locationSlideCount;
  }, [locationSlideCount]);

  useEffect(
    () => () => {
      clearLocationAutoplayTimer();
      clearLocationResumeTimer();
    },
    [clearLocationAutoplayTimer, clearLocationResumeTimer]
  );

  useEffect(() => {
    if (!isLocationSlider || locationSlideCount <= 1) {
      clearLocationAutoplayTimer();
      clearLocationResumeTimer();
      swiperRef.current = null;
    }
  }, [isLocationSlider, locationSlideCount, clearLocationAutoplayTimer, clearLocationResumeTimer]);

  useEffect(() => {
    if (!isLocationSlider || locationSlideCount <= 1) {
      inViewportRef.current = false;
      clearLocationAutoplayTimer();
      return;
    }

    const el = locationSliderViewportRef.current;
    if (!el) {
      inViewportRef.current = false;
      clearLocationAutoplayTimer();
      return;
    }

    const syncAutoplayVisibility = (visible: boolean) => {
      inViewportRef.current = visible;

      if (visible) {
        if (!pausedRef.current) scheduleLocationAutoplayStep();
      } else {
        clearLocationAutoplayTimer();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        syncAutoplayVisibility(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    const queued = observer.takeRecords();
    if (queued.length) {
      syncAutoplayVisibility(queued[queued.length - 1]?.isIntersecting ?? false);
    }

    return () => {
      observer.disconnect();
      inViewportRef.current = false;
      clearLocationAutoplayTimer();
    };
  }, [
    isLocationSlider,
    locationSlideCount,
    clearLocationAutoplayTimer,
    scheduleLocationAutoplayStep,
  ]);

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
    window.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("resize", sync);
    };
  }, []);

  useEffect(() => {
    const orientationTimeouts: number[] = [];

    const refreshLayout = () => {
      const sw = swiperRef.current;
      if (sw && !sw.destroyed) {
        sw.update();
      }

      const map = mapInstanceRef.current;
      map?.container?.fitToViewport?.();
    };

    const onResize = () => {
      refreshLayout();
    };

    const onOrientation = () => {
      requestAnimationFrame(refreshLayout);
      orientationTimeouts.push(window.setTimeout(refreshLayout, 100));
      orientationTimeouts.push(window.setTimeout(refreshLayout, 350));
    };

    let mapResizeRafId = 0;
    const mapContainer = mapContainerRef.current;
    let mapResizeObserver: ResizeObserver | undefined;

    if (mapContainer) {
      mapResizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(mapResizeRafId);
        mapResizeRafId = requestAnimationFrame(refreshLayout);
      });
      mapResizeObserver.observe(mapContainer);
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(mapResizeRafId);
      mapResizeObserver?.disconnect();
      orientationTimeouts.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const apiKey = MAP_API_KEY;
    if (!apiKey) return;

    let cancelled = false;
    const items = LOCATION_BY_CITY[citySlug];

    const run = async () => {
      try {
        await loadYandexMaps(apiKey);
      } catch {
        return;
      }
      if (cancelled || !mapContainerRef.current || !window.ymaps) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            map.setCenter([item.coords[0], item.coords[1]], LOCATION_MAP_MAX_ZOOM, {
              duration: 300,
            });
          });
          map.geoObjects.add(placemark);
        });

        const bounds = map.geoObjects.getBounds();
        if (bounds) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fit = (map as any).setBounds(bounds, {
            checkZoomRange: true,
            zoomMargin: 48,
          }) as PromiseLike<unknown>;
          void Promise.resolve(fit).then(() => {
            if (cancelled) return;
            if (map.getZoom() > LOCATION_MAP_MAX_ZOOM) {
              map.setZoom(LOCATION_MAP_MAX_ZOOM, { duration: 0 });
            }
          });
        }
      });
    };

    void run();

    return () => {
      cancelled = true;
      mapInstanceRef.current?.destroy();
      mapInstanceRef.current = null;
    };
  }, [citySlug]);

  return (
    <section id="location" className="home-page__block home-page__location">
      <div className="home-page__container">
        <div className="home-page__location-wrapper">
          <div className="home-page__location-top">
            <div className="home-page__tag">{tag}</div>
            <h2 className="home-page__h2 home-page__location-title">{title}</h2>
          </div>

          <div className="home-page__location-body">
            <p className="home-page__location-body--title">{CITY_DISPLAY_NAME[citySlug]}</p>

            <div className="home-page__location-body-wrapper">
              {isLocationSlider ? (
                <div
                  ref={locationSliderViewportRef}
                  className="home-page__location-swiper-stack"
                  onPointerDownCapture={
                    locationSlideCount > 1 ? onLocationSliderUserInteraction : undefined
                  }
                >
                  <div
                    ref={locationPaginationElRef}
                    className="swiper-pagination home-page__location-swiper-pagination"
                  />

                  <Swiper
                    key={citySlug}
                    modules={[Pagination]}
                    observer
                    observeParents
                    rewind
                    grabCursor
                    watchOverflow={false}
                    slidesPerView={1}
                    spaceBetween={10}
                    className="home-page__location-swiper"
                    onBeforeInit={onLocationSwiperBeforeInit}
                    onSwiper={onLocationSwiperMount}
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

                {MAP_API_KEY && (
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
