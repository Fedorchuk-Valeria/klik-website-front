import Image from "next/image";

import ArrowSVG from "@/src/assets/images/view/contacts/arrow.svg";
import image from "@/src/assets/images/view/contacts/boy.jpg";
import LineSVG from "@/src/assets/images/view/contacts/line.svg";

import LayoutPlatform from "@/src/components/Layouts/LayoutPlatform";
import Breadcrumb from "@/src/components/ui/Breadcrumb/Breadcrumb";
import Icon from "@/src/components/ui/Icon/Icon";

const PUBLIC_CONTRACT_URL = "/files/public-contract.pdf";

const ContactsPage = () => {
  const info = [
    {
      icon: "note",
      title: "Полное наименование и юридический статус",
      list: [
        {
          title: "Исполнитель:",
          value: "Общество с ограниченной ответственностью «ТАЙМКЛИК»",
        },
        {
          title: "УНП:",
          value: "193397920",
        },
      ],
    },
    {
      icon: "pin",
      title: "Местонахождение (Юридический адрес)",
      list: [
        {
          title: "Адрес:",
          value: "Республика Беларусь, 220007, г. Минск, ул. Аэродромная, д. 125, каб. 29.",
        },
        {
          title: "Время работы:",
          value: "ПН-ПТ 09:00-18:00",
        },
      ],
    },
    {
      icon: "call-phone",
      title: "Телефон для связи (Viber, Telegram)",
      list: [
        {
          title: "Телефон:",
          value: "+375 29 633 27 79",
        },
      ],
    },
  ];

  const bankDetails = [
    {
      title: "Расчетный счет (IBAN)",
      value: "BY30MTBK30120001093300128153",
    },
    {
      title: "Валюта счета",
      value: "Белорусские рубли (BYN)",
    },
    {
      title: "Банк",
      value: "ЗАО «МТБанк», г. Минск",
    },
    {
      title: "БИК",
      value: "MTBKBY22",
    },
  ];

  return (
    <LayoutPlatform headerVariant="dark" showAuthControls={true}>
      <div className={"contacts-view"}>
        <Breadcrumb
          currentLabel="Контактная информация"
          className="contacts-view__breadcrumb"
          variant="orange"
        />

        <h1 className="contacts-view__title">Контактная информация</h1>

        <div className="contacts-view__content">
          <div className="contacts-view__info">
            {info.map((item, index) => (
              <div className="contacts-view__info-item" key={index}>
                <span className="contacts-view__info-item__icon">
                  <Icon name={item.icon} />
                </span>

                <div className="contacts-view__info-item__content">
                  <p className="contacts-view__info-item__content-title">{item.title}</p>

                  <ul className="contacts-view__info-item__content-list">
                    {item.list.map((item, index) => (
                      <li className="contacts-view__info-item__content-list_item" key={index}>
                        <p>{item.title}</p>
                        <p>{item.value}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="contacts-view__image">
            <Image src={image} alt="contacts" fill />

            <div className="contacts-view__image-line-clip">
              <LineSVG className="contacts-view__image-line" />
            </div>

            <ArrowSVG className="contacts-view__image-arrow" />
          </div>

          <div className="contacts-view__payment">
            <div className="contacts-view__payment-item">
              <div className={"contacts-view__payment-item_headline"}>
                <span>
                  <Icon name="success-payment" />
                </span>

                <p>Банковские реквизиты</p>
              </div>

              <ul className="contacts-view__payment-item_list">
                {bankDetails.map((item, index) => (
                  <li className="contacts-view__payment-item_list-item" key={index}>
                    <p className="contacts-view__payment-item_list-item_title">{item.title}</p>
                    <p className="contacts-view__payment-item_list-item_value">{item.value}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contacts-view__payment-button">
              <a
                href={PUBLIC_CONTRACT_URL}
                download="public-contract.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="contacts-view__payment-button--download"
                aria-label="Скачать публичный договор"
              >
                <Icon name="pdf" />
              </a>

              <p>Публичный договор (файл PDF)</p>
            </div>
          </div>
        </div>
      </div>
    </LayoutPlatform>
  );
};

export default ContactsPage;
