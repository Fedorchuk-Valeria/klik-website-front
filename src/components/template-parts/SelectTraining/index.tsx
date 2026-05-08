import Image from "next/image";
import { FC } from "react";

import HomePageForm from "@/src/components/template-parts/Form";

import CloudSvg from "@/src/assets/images/templates/homepage/selectTraining/cloud.svg";
import girl from "@/src/assets/images/templates/homepage/selectTraining/girl.png";
import Line from "@/src/assets/images/templates/homepage/selectTraining/line.svg";

type PropTypes = {
  tag?: string;
  title?: string;
  text?: string;
  items?: { title: string; text: string }[];
};

const SelectTraining: FC<PropTypes> = ({ tag, title, text, items }) => {
  return (
    <section id="select-training" className="select-training">
      <span className="select-training__line">
        <Line />
      </span>

      <span className="select-training__image-cloud">
        <CloudSvg />
      </span>

      <span className="select-training__image-girl">
        <Image src={girl} alt="Cloud" fill />
      </span>

      <div className="select-training__block">
        <div className="select-training__container">
          <ul className="select-training__items">
            {items?.map((item, index) => (
              <li className="select-training__item" key={index}>
                <span className="select-training__item-title">{item.title}</span>

                <span className="select-training__item-text">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="select-training__form">
          {title && <h3 className="select-training__title">{title}</h3>}

          {text && <p className="select-training__text">{text}</p>}

          <HomePageForm />
        </div>
      </div>
    </section>
  );
};

export default SelectTraining;
