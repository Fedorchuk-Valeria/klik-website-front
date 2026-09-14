"use client";

import Image from "next/image";
import { useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";

import type { ProgramPage } from "@/src/lib/content/types";
import classNames from "classnames";

type Props = {
  items: ProgramPage["content"]["items"];
};

export default function ProgramLessonsBlocks({ items }: Props) {
  const total = items.length;
  const [activeIndex, setActiveIndex] = useState(0);

  if (total === 0) {
    return null;
  }

  const lesson = items[activeIndex];
  const showNav = total > 1;
  const paddedTotal = String(total).padStart(2, "0");

  const goPrev = () => {
    setActiveIndex((i) => (i === 0 ? total - 1 : i - 1));
  };

  const goNext = () => {
    setActiveIndex((i) => (i === total - 1 ? 0 : i + 1));
  };

  return (
    <>
      <ul className="program-view__lessons-list program-view__lessons-list--desktop">
        {items.map((lessonItem, index) => (
          <li key={`${lessonItem.title}-${index}`} className="program-view__lessons-item">
            {lessonItem?.photo && (
              <div className="program-view__lessons-item_image">
                <Image
                  src={lessonItem.photo}
                  alt={lessonItem.title}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  fill
                />
              </div>
            )}

            <div className="program-view__lessons-item_content">
              <span className="program-view__lessons-item_content-number">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>/{paddedTotal}</span>
              </span>

              <p className="program-view__lessons-item_content-title">{lessonItem.title}</p>
              <p className="program-view__lessons-item_content-text">{lessonItem.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <div
        className="program-view__lessons-slider"
        aria-roledescription="карусель"
        aria-label="Основные блоки"
      >
        <div className="program-view__lessons-slide" aria-live="polite">
          <div className="program-view__lessons-slide_inner">
            {lesson.photo && (
              <div className="program-view__lessons-slide_image">
                <Image
                  src={lesson.photo}
                  alt={lesson.title}
                  sizes="(max-width: 680px) 100vw, 320px"
                  fill
                />
              </div>
            )}

            <div className="program-view__lessons-slide_body">
              <span className="program-view__lessons-slide_count program-view__lessons-slide_count--corner">
                <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                <span>/{paddedTotal}</span>
              </span>

              <span className="program-view__lessons-slide_count program-view__lessons-slide_count--hero">
                <span className="program-view__lessons-slide_count-current">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="program-view__lessons-slide_count-sep"> / </span>
                <span className="program-view__lessons-slide_count-total">{paddedTotal}</span>
              </span>

              <p className="program-view__lessons-slide_title">{lesson.title}</p>
              <p className="program-view__lessons-slide_text">{lesson.description}</p>
            </div>
          </div>
        </div>

        {showNav && (
          <div className="program-view__lessons-slider_nav">
            <span className="program-view__lessons-slider_counter" aria-live="polite">
              <span>{activeIndex + 1}/</span>
              <span>{total}</span>
            </span>
            <div className="program-view__lessons-slider_buttons">
              <button
                type="button"
                className={classNames(
                  "program-view__lessons-slider_button",
                  "program-view__lessons-slider_button--back"
                )}
                onClick={goPrev}
                aria-label="Назад"
              >
                <Icon name="arrow" className="program-view__lessons-slider_icon" />
              </button>

              <button
                type="button"
                className={classNames(
                  "program-view__lessons-slider_button",
                  "program-view__lessons-slider_button--forward"
                )}
                onClick={goNext}
                aria-label="Вперёд"
              >
                <Icon name="arrow" className="program-view__lessons-slider_icon" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
