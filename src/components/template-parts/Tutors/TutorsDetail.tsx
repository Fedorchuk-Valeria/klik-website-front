"use client";

import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import type { TutorItem } from "./types";

const TUTORS_DETAIL_FADE_MS = 300;

type PropTypes = {
  item: TutorItem;
  onPrev: () => void;
  onNext: () => void;
};

const TutorsDetailContent: FC<{ item: TutorItem }> = ({ item }) => (
  <>
    <div className="home-page__tutors-detail__text">
      <h3 className="home-page__tutors-detail__name">
        <span>{item.name}</span>
      </h3>
      <p className="home-page__tutors-detail__position">{item.position}</p>
    </div>

    <p className="home-page__tutors-detail__description">
      <span>{item.text}</span>
    </p>

    <div className="home-page__tutors-detail__location">
      <Icon name="pin" />
      {item.location}
    </div>
  </>
);

const TutorsDetail: FC<PropTypes> = ({ item, onPrev, onNext }) => {
  const [displayed, setDisplayed] = useState(item);
  const [outgoing, setOutgoing] = useState<TutorItem | null>(null);
  const [fadeActive, setFadeActive] = useState(false);
  const displayedRef = useRef(item);

  useEffect(() => {
    if (item.id === displayedRef.current.id) return;

    setOutgoing(displayedRef.current);
    setDisplayed(item);
    displayedRef.current = item;
    setFadeActive(false);

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setFadeActive(true));
    });

    const timerId = window.setTimeout(() => {
      setOutgoing(null);
      setFadeActive(false);
    }, TUTORS_DETAIL_FADE_MS);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(timerId);
    };
  }, [item]);

  const isCrossfading = outgoing != null;

  return (
    <aside className="home-page__tutors-detail" aria-live="polite" aria-atomic="true">
      <div className="home-page__tutors-detail__inner">
        <div
          className={classNames("home-page__tutors-detail__layers", {
            "home-page__tutors-detail__layers--crossfade": isCrossfading,
          })}
        >
          {outgoing && (
            <div
              key={outgoing.id}
              className={classNames(
                "home-page__tutors-detail__layer",
                "home-page__tutors-detail__layer--out",
                { "is-fading": fadeActive }
              )}
              aria-hidden
            >
              <TutorsDetailContent item={outgoing} />
            </div>
          )}

          <div
            key={displayed.id}
            className={classNames(
              "home-page__tutors-detail__layer",
              "home-page__tutors-detail__layer--in",
              {
                "is-fading": fadeActive,
                "is-static": !isCrossfading,
              }
            )}
          >
            <TutorsDetailContent item={displayed} />
          </div>
        </div>

        <div className="home-page__tutors-detail__nav">
          <Button
            variant="orange"
            type="button"
            className={classNames("home-page__tutors-nav", "home-page__tutors-nav--prev")}
            aria-label="Предыдущий наставник"
            onClick={onPrev}
          >
            <Icon className="home-page__tutors-nav-icon" name="arrow" />
          </Button>

          <Button
            variant="orange"
            type="button"
            className={classNames("home-page__tutors-nav", "home-page__tutors-nav--next")}
            aria-label="Следующий наставник"
            onClick={onNext}
          >
            <Icon className="home-page__tutors-nav-icon" name="arrow" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default TutorsDetail;
