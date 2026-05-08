"use client";

import classNames from "classnames";
import Image from "next/image";
import { FC, ReactNode } from "react";

import image from "@/src/assets/images/templates/homepage/signUpFreeLesson/sign-up-for-free-lesson.png";

import EyesSVG from "@/src/assets/images/templates/homepage/signUpFreeLesson/eyes.svg";
import FlowerSVG from "@/src/assets/images/templates/homepage/signUpFreeLesson/flower.svg";
import SpiralSVG from "@/src/assets/images/templates/homepage/signUpFreeLesson/spiral.svg";
import UnderlineSVG from "@/src/assets/images/templates/homepage/signUpFreeLesson/underline.svg";
import HomePageForm from "@/src/components/template-parts/Form";

function itemTitleWithThirdWordBold(title: string): ReactNode {
  const words = title.split(" ");

  return (
    <>
      {words.slice(0, 1).join(" ")} <strong>{words[1]}</strong>
      {words.length > 2 ? ` ${words.slice(2).join(" ")}` : ""}
    </>
  );
}

type PropTypes = {
  title: string;
  text: string;
  items: {
    id: number;
    title: string;
    text: string;
  }[];
};

const SignUpFreeLesson: FC<PropTypes> = ({ title, text, items }) => {
  return (
    <section
      id="sign-up-free-lesson"
      className={classNames("home-page__block", "sign-up-free-lesson")}
    >
      <div className="sign-up-free-lesson__block">
        <span className="sign-up-free-lesson__flower">
          <FlowerSVG />
        </span>

        <span className="sign-up-free-lesson__spiral">
          <SpiralSVG />
        </span>

        <span className="sign-up-free-lesson__eyes">
          <EyesSVG />
        </span>

        <div className="sign-up-free-lesson__container">
          <div className="sign-up-free-lesson__image">
            <Image src={image} alt={"Форма заполнения контактов на бесплатное занятие"} fill />
          </div>

          {title && (
            <h2 className={classNames("home-page__h2", "sign-up-free-lesson__title")}>
              {itemTitleWithThirdWordBold(title)}

              <span className="sign-up-free-lesson__title-underline">
                <UnderlineSVG />
              </span>
            </h2>
          )}

          {text && <p className="sign-up-free-lesson__text">{text}</p>}

          <ul className="sign-up-free-lesson__items">
            {items.map((item) => (
              <li className="sign-up-free-lesson__item" key={item.id}>
                <span className="sign-up-free-lesson__item-title">{item.title}</span>

                <span className="sign-up-free-lesson__item-text">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sign-up-free-lesson__form">
          <h3 className="sign-up-free-lesson__form-title">Начните с пробного урока</h3>
          <p className="sign-up-free-lesson__form-text">
            Заполните анкету, чтобы мы могли подобрать удобное для вас время пробного занятия
          </p>

          <HomePageForm />
        </div>
      </div>
    </section>
  );
};

export default SignUpFreeLesson;
