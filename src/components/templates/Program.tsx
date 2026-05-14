import classNames from "classnames";
import Image from "next/image";

import lessonImage from "@/src/assets/images/templates/programPage/girl.jpg";

import HomePageForm from "@/src/components/template-parts/Form";
import Breadcrumb from "@/src/components/ui/Breadcrumb/Breadcrumb";

import { Page } from "@/src/lib/content/types";

type ProgramViewProps = {
  page: Page;
};

export default function ProgramView({ page }: ProgramViewProps) {
  if (page.template !== "program") {
    throw new Error('Program: ожидался template "program"');
  }

  const formList = [
    {
      title: "100%",
      text: "бесплатное первое занятие",
    },
    {
      title: "60 минут",
      text: "занятие с наставником",
    },
    {
      title: "0%",
      text: "обязательств",
    },
  ];

  const totalLessons = page.content.items.length;

  return (
    <section className="program-view">
      <div className="program-view__container">
        <Breadcrumb currentLabel="Программы по возрастам" className="program-view__breadcrumb" />

        <h1 className="program-view__title">{page.seo.h1}</h1>

        <div className="program-view__block">
          <div className={classNames("program-view__block-left", page.content.color)}>
            <span className="program-view__block-left--tag">{page.content.tag}</span>

            <h2 className="program-view__block-left--title">{page.content.title}</h2>

            <p className="program-view__block-left--text">{page.content.text}</p>
          </div>

          <div className="program-view__block-right">
            <Image
              src="https://placehold.co/600x400.png"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              alt={page.seo.h1}
            />
          </div>
        </div>

        <div className="program-view__lessons">
          <p className="program-view__lessons-title">Основные блоки</p>

          <div className="program-view__lessons-items">
            <ul className="program-view__lessons-list">
              {page.content.items.map((lesson, index) => (
                <li
                  key={`${lesson.number}-${lesson.title}-${index}`}
                  className="program-view__lessons-item"
                >
                  <div className="program-view__lessons-item_image">
                    <Image
                      src={lessonImage.src}
                      alt={lesson.title}
                      sizes="(max-width: 900px) 100vw, 50vw"
                      fill
                    />
                  </div>

                  <div className="program-view__lessons-item_content">
                    <span className="program-view__lessons-item_content-number">
                      <span>{lesson.number}</span>
                      <span>/{totalLessons < 10 ? `0${totalLessons}` : totalLessons}</span>
                    </span>
                    <p className="program-view__lessons-item_content-title">{lesson.title}</p>
                    <p className="program-view__lessons-item_content-text">{lesson.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="program-view__lessons-form">
              <p className="program-view__lessons-form_title">
                Запишитесь на бесплатное пробное занятие
              </p>
              <span className="program-view__lessons-form_text">
                Заполните анкету, и мы подберём удобное для вас время
              </span>

              <HomePageForm />

              <ul className="program-view__lessons-form_items">
                {formList.map((item, index) => (
                  <li key={index}>
                    <p>{item.title}</p>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
