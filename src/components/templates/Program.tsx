import classNames from "classnames";
import Image from "next/image";

import Breadcrumb from "@/src/components/ui/Breadcrumb/Breadcrumb";
import { Page } from "@/src/lib/content/types";

type ProgramViewProps = {
  page: Page;
};

export default function ProgramView({ page }: ProgramViewProps) {
  if (page.template !== "program") {
    throw new Error('Program: ожидался template "program"');
  }

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
          <h2>Основные блоки</h2>

          <div className="program-view__lessons-items">
            <ul className="program-view__lessons-list">
              {page.content.items.map((lesson, index) => (
                <li key={`${lesson.number}-${lesson.title}-${index}`}>
                  <span>{lesson.number}</span>
                  <p>{lesson.title}</p>
                  <p>{lesson.text}</p>
                </li>
              ))}
            </ul>

            <div className="program-view__lessons-form"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
