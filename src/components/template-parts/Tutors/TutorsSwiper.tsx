"use client";

import Image from "next/image";
import { FC, RefObject, useCallback, useMemo } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { TUTOR_IMAGES } from "./tutorImages";
import type { TutorItem } from "./types";

const TUTOR_IMG_W_COMPACT = 360;
const TUTOR_IMG_H_COMPACT = 450;

export type TutorsSwiperSlide = {
  item: TutorItem;
  key: string;
};

export type TutorsSwiperProps = {
  slidesForSwiper: TutorsSwiperSlide[];
  activeIndex: number;
  tutorCount: number;
  tutorsPaginationEnabled: boolean;
  /** swipte only at <=800px, >=1024 */
  swipeEnabled: boolean;
  paginationElRef: RefObject<HTMLDivElement | null>;
  onSwiper: (swiper: SwiperType) => void;
  onSwiperClick: (swiper: SwiperType) => void;
  onSlideChange: (swiper: SwiperType) => void;
  onSwiperSliderFirstMove: () => void;
};

const TutorsSwiper: FC<TutorsSwiperProps> = ({
  slidesForSwiper,
  activeIndex,
  tutorCount,
  tutorsPaginationEnabled,
  swipeEnabled,
  paginationElRef,
  onSwiper,
  onSwiperClick,
  onSlideChange,
  onSwiperSliderFirstMove,
}) => {
  const swiperSlides = useMemo(
    () =>
      slidesForSwiper.map(({ item, key }) => {
        const img = item ? TUTOR_IMAGES[item.id] : undefined;
        if (!item || !img) return null;

        return (
          <SwiperSlide key={key} className="home-page__tutors-slide">
            <div className="home-page__tutors-thumb">
              <div className="home-page__tutors-thumb__tags" aria-hidden>
                {item.tags.map((tutorTag) => (
                  <span className="home-page__tutors-tag" key={`${key}-${tutorTag}`}>
                    {tutorTag}
                  </span>
                ))}
              </div>

              <div className="home-page__tutors-thumb__img-wrap">
                <Image
                  className="home-page__tutors-thumb__img"
                  src={img}
                  alt=""
                  width={TUTOR_IMG_W_COMPACT}
                  height={TUTOR_IMG_H_COMPACT}
                  sizes={`${TUTOR_IMG_W_COMPACT}px`}
                  draggable={false}
                />
              </div>
            </div>
          </SwiperSlide>
        );
      }),
    [slidesForSwiper]
  );

  const onPaginationBeforeInit = useCallback(
    (swiper: SwiperType) => {
      if (!tutorsPaginationEnabled || !paginationElRef.current) return;
      const { pagination } = swiper.params;
      if (pagination && typeof pagination === "object") {
        pagination.el = paginationElRef.current;
      }
    },
    [paginationElRef, tutorsPaginationEnabled]
  );

  return (
    <div className="home-page__tutors-swiper-wrap">
      <Swiper
        modules={[Pagination]}
        speed={0}
        grabCursor={swipeEnabled}
        allowTouchMove={swipeEnabled}
        simulateTouch={swipeEnabled}
        resizeObserver
        slidesPerView={1}
        initialSlide={activeIndex}
        key={`tutor-compact-${tutorCount}-pg-${tutorsPaginationEnabled ? 1 : 0}`}
        className="home-page__tutors-swiper"
        spaceBetween={0}
        observer={false}
        watchOverflow={false}
        centeredSlides={false}
        observeSlideChildren={false}
        pagination={
          tutorsPaginationEnabled
            ? {
                clickable: true,
                hideOnClick: false,
                bulletClass: "home-page__tutors-pagination-bullet",
                bulletActiveClass: "home-page__tutors-pagination-bullet--active",
              }
            : false
        }
        onBeforeInit={onPaginationBeforeInit}
        onSwiper={onSwiper}
        onClick={onSwiperClick}
        onSlideChange={onSlideChange}
        onSliderFirstMove={onSwiperSliderFirstMove}
      >
        {swiperSlides}
      </Swiper>
    </div>
  );
};

export default TutorsSwiper;
