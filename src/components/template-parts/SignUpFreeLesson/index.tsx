"use client";

import classNames from "classnames";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FC, ReactNode } from "react";

import image from "@/src/assets/images/templates/homepage/signUpFreeLesson/sign-up-for-free-lesson.png";

import EyesSVG from "@/src/assets/images/templates/homepage/signUpFreeLesson/eyes.svg";
import FlowerSVG from "@/src/assets/images/templates/homepage/signUpFreeLesson/flower.svg";
import SpiralSVG from "@/src/assets/images/templates/homepage/signUpFreeLesson/spiral.svg";
import UnderlineSVG from "@/src/assets/images/templates/homepage/signUpFreeLesson/underline.svg";

import Button from "@/src/components/ui/Button/Button";
import Checkbox from "@/src/components/ui/Checkbox";
import DateInput from "@/src/components/ui/DateInput";
import PhoneInput from "@/src/components/ui/PhoneInput";
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

const MAX_TEXT_FIELD_LENGTH = 100;

const SignUpFreeLesson: FC<PropTypes> = ({ title, text, items }) => {
  const form = useFormik({
    initialValues: {
      parent: "",
      child: "",
      phone: "",
      date: "",
      agreedment: false,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    form.handleChange(e);
    form.validateField(e.target.name);
  };

  return (
    <section className={classNames("home-page__block", "sign-up-free-lesson")}>
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

          <form className="sign-up-free-lesson__form-body" onSubmit={form.handleSubmit}>
            <TextInput
              required
              max={MAX_TEXT_FIELD_LENGTH}
              maxLength={MAX_TEXT_FIELD_LENGTH}
              name="parent"
              label="ФИО родителя"
              value={form.values.parent}
              error={form.errors.parent}
              onChange={handleChange}
              placeholder="Иванов Иван Иванович"
              className="sign-up-free-lesson__form-input"
            />

            <TextInput
              required
              max={MAX_TEXT_FIELD_LENGTH}
              maxLength={MAX_TEXT_FIELD_LENGTH}
              name="child"
              label="ФИО ребенка"
              value={form.values.child}
              error={form.errors.child}
              onChange={handleChange}
              placeholder="Иванов Иван Иванович"
              className="sign-up-free-lesson__form-input"
            />

            <PhoneInput
              required
              name="phone"
              label="Телефон"
              value={form.values.phone}
              error={form.errors.phone}
              onChange={handleChange}
              placeholder="+375 (29) 123-45-67"
              className="sign-up-free-lesson__form-input"
            />

            <DateInput
              name="date"
              label="Дата рождения ребёнка"
              value={form.values.date}
              error={form.errors.date}
              onChange={handleChange}
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

            <div className="sign-up-free-lesson__form-checkbox-container">
              <Checkbox
                id="agreedment"
                name="agreedment"
                checked={form.values.agreedment}
                error={form.errors.agreedment}
                onChange={(checked) => form.setFieldValue("agreedment", checked)}
                className="sign-up-free-lesson__form-checkbox"
              />

              <span className="sign-up-free-lesson__form-checkbox--text">
                Я соглашаюсь с
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sign-up-free-lesson__form-checkbox--link"
                >
                  политикой обработки конфиденциальных данных
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpFreeLesson;
