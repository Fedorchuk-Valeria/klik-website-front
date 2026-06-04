"use client";

import classNames from "classnames";
import Image from "next/image";
import { FC, RefObject, useCallback, useMemo } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { TUTOR_IMAGES } from "./tutorImages";
import type { TutorItem } from "./types";

export const TUTORS_SWIPER_SPEED_MS = 300;

const SLIDE_GAP = 20;
const SLIDE_INACTIVE_W = 270;
const SLIDE_ACTIVE_W = 560;
const SLIDES_OFFSET_BEFORE = SLIDE_INACTIVE_W + SLIDE_GAP;
const SLIDES_OFFSET_AFTER = SLIDE_ACTIVE_W + SLIDE_INACTIVE_W * 2 + SLIDE_GAP * 2;
const TUTOR_IMG_W_COMPACT = 360;
const TUTOR_IMG_H_COMPACT = 450;

export type TutorsSwiperSlide = {
  item: TutorItem;
  key: string;
};

export type TutorsSwiperProps = {
  slidesForSwiper: TutorsSwiperSlide[];
  isTabletLandscapeTutors: boolean;
  activeIndex: number;
  initialSlideMid: number;
  tutorCount: number;
  isMovePhase: boolean;
  tutorsPaginationEnabled: boolean;
  paginationElRef: RefObject<HTMLDivElement | null>;
  onSwiper: (swiper: SwiperType) => void;
  onSwiperClick: (swiper: SwiperType) => void;
  onSlideChange: (swiper: SwiperType) => void;
  onSlideChangeTransitionEnd: (swiper: SwiperType) => void;
  onSwiperSliderFirstMove: () => void;
};

const TutorsSwiper: FC<TutorsSwiperProps> = ({
  slidesForSwiper,
  isTabletLandscapeTutors,
  activeIndex,
  initialSlideMid,
  tutorCount,
  isMovePhase,
  tutorsPaginationEnabled,
  paginationElRef,
  onSwiper,
  onSwiperClick,
  onSlideChange,
  onSlideChangeTransitionEnd,
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
                  width={isTabletLandscapeTutors ? TUTOR_IMG_W_COMPACT : 560}
                  height={isTabletLandscapeTutors ? TUTOR_IMG_H_COMPACT : 700}
                  sizes={
                    isTabletLandscapeTutors
                      ? `${TUTOR_IMG_W_COMPACT}px`
                      : "(max-width: 1440px) 414px, 560px"
                  }
                  draggable={false}
                />
              </div>
            </div>
          </SwiperSlide>
        );
      }),
    [isTabletLandscapeTutors, slidesForSwiper]
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

  const swiperEl = (
    <Swiper
      modules={[Pagination]}
      speed={isTabletLandscapeTutors ? 0 : TUTORS_SWIPER_SPEED_MS}
      grabCursor
      resizeObserver
      slidesPerView={isTabletLandscapeTutors ? 1 : "auto"}
      initialSlide={isTabletLandscapeTutors ? activeIndex : initialSlideMid}
      key={
        isTabletLandscapeTutors
          ? `tutor-compact-${tutorCount}-pg-${tutorsPaginationEnabled ? 1 : 0}`
          : `tutor-order-${tutorCount}`
      }
      className={classNames("home-page__tutors-swiper", {
        "home-page__tutors-swiper--phase-move": !isTabletLandscapeTutors && isMovePhase,
      })}
      spaceBetween={isTabletLandscapeTutors ? 0 : SLIDE_GAP}
      slidesOffsetAfter={isTabletLandscapeTutors ? 0 : SLIDES_OFFSET_AFTER}
      slidesOffsetBefore={isTabletLandscapeTutors ? 0 : SLIDES_OFFSET_BEFORE}
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
      onSlideChangeTransitionEnd={onSlideChangeTransitionEnd}
      onSliderFirstMove={onSwiperSliderFirstMove}
    >
      {swiperSlides}
    </Swiper>
  );

  if (isTabletLandscapeTutors) {
    return <div className="home-page__tutors-swiper-wrap">{swiperEl}</div>;
  }

  return swiperEl;
};

export default TutorsSwiper;
