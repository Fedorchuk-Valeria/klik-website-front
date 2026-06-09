import classNames from "classnames";
import Image from "next/image";

import ClickersSvg from "@/src/assets/images/templates/programPage/clickers.svg";
import CodersSvg from "@/src/assets/images/templates/programPage/coders.svg";
import CreatorsSvg from "@/src/assets/images/templates/programPage/creators.svg";

import imgClickers from "@/src/assets/images/templates/programPage/clickers.jpg";
import imgCoders from "@/src/assets/images/templates/programPage/coders.jpg";
import imgCreators from "@/src/assets/images/templates/programPage/creators.jpg";
import lessonImage from "@/src/assets/images/templates/programPage/girl.jpg";

import HomePageForm from "@/src/components/template-parts/Form";
import ProgramLessonsBlocks from "@/src/components/templates/ProgramLessonsBlocks";
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

  return (
    <section className="program-view">
      <div className="program-view__container">
        <Breadcrumb currentLabel="Программы по возрастам" className="program-view__breadcrumb" />

        <h1 className="program-view__title">{page.seo.h1}</h1>

        <div className="program-view__block">
          <div className={classNames("program-view__block-left", page.content.color)}>
            <span className="program-view__block-left--tag">{page.content.tag}</span>

            <span className={classNames("program-view__block-left--image", page.content.color)}>
              {page.content.color === "green" && <CreatorsSvg />}
              {page.content.color === "pink" && <CodersSvg />}
              {page.content.color === "blue" && <ClickersSvg />}
            </span>

            <h2 className="program-view__block-left--title">{page.content.title}</h2>

            <p className="program-view__block-left--text">{page.content.text}</p>
          </div>

          <div className="program-view__block-right">
            <Image
              src={
                page.content.color === "blue"
                  ? imgClickers.src
                  : page.content.color === "pink"
                    ? imgCoders.src
                    : imgCreators.src
              }
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              alt={page.seo.h1}
            />
          </div>
        </div>

        <div className="program-view__lessons">
          <p className="program-view__lessons-title">Основные блоки</p>

          <div className="program-view__lessons-items">
            <ProgramLessonsBlocks items={page.content.items} lessonImageSrc={lessonImage.src} />

            <div className="program-view__lessons-form">
              <p className="program-view__lessons-form_title">
                Запишитесь на бесплатное пробное занятие
              </p>
              <span className="program-view__lessons-form_text">
                Заполните анкету, и мы подберём удобное для вас время
              </span>

              <HomePageForm className="program-view__lessons-form_form" />

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
