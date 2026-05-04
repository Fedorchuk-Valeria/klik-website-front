"use client";

import classNames from "classnames";
import { useFormik } from "formik";
import Image from "next/image";
import { FC, ReactNode } from "react";

import image from "@/src/assets/images/templates/homepage/signUpFreeLesson/sign-up-for-free-lesson.png";

import UnderlineSVG from "@/src/assets/images/templates/homepage/signUpFreeLesson/underline.svg";

import Button from "@/src/components/ui/Button/Button";
import TextInput from "@/src/components/ui/TextInput";

import { validationSchema } from "./validationSchema";

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
  const form = useFormik({
    initialValues: {
      parent: "",
      child: "",
      phone: "",
      date: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <section className={classNames("home-page__block", "sign-up-free-lesson")}>
      <div className={"sign-up-free-lesson__block"}>
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

          <form className="sign-up-free-lesson__form-body" onSubmit={form.handleSubmit}>
            <TextInput
              required
              name="parent"
              label="ФИО родителя"
              value={form.values.parent}
              error={form.errors.parent}
              onChange={form.handleChange}
              placeholder="Иванов Иван Иванович"
              className="sign-up-free-lesson__form-input"
            />

            <TextInput
              required
              name="child"
              label="ФИО ребенка"
              value={form.values.child}
              error={form.errors.child}
              onChange={form.handleChange}
              placeholder="Иванов Иван Иванович"
              className="sign-up-free-lesson__form-input"
            />

            <Button
              type="submit"
              variant="main-green-dark"
              withArrow
              className="sign-up-free-lesson__form-button"
            >
              Оставить заявку
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpFreeLesson;
