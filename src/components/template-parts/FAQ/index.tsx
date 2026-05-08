"use client";

import { FC } from "react";

import Button from "@/src/components/ui/Button/Button";
import FAQ from "@/src/components/ui/Faq/Faq";

import { FaqItem, LinkButton } from "@/src/lib/content/types";
import { PAGE_ANCHORS } from "@/src/utils/constant";

type PropTypes = {
  tag?: string;
  title?: string;
  text?: string;
  items?: FaqItem[];
  footer?: {
    title?: string;
    text?: string;
    button?: LinkButton;
  };
};

const FAQPage: FC<PropTypes> = ({ footer, items, tag, text, title }) => {
  const onClick = () => {
    const el = document.getElementById(PAGE_ANCHORS.SIGN_UP_FREE_LESSON);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  };

  return (
    <section className="home-page__block home-page__faq" id={PAGE_ANCHORS.FAQ}>
      <div className="home-page__container">
        <div className="home-page__faq-wrapper">
          <div className="home-page__faq-left">
            <div className="home-page__faq-top">
              {tag && <div className="home-page__tag">{tag}</div>}
              {title && <h2 className="home-page__h2 home-page__faq-title">{title}</h2>}
              {text && <div className="home-page__faq-text">{text}</div>}
            </div>

            <div className="home-page__faq-bottom">
              <div className="home-page__faq-bottom_body">
                {footer?.title && <div className="home-page__faq-bottom_title">{footer.title}</div>}
                {footer?.text && <div className="home-page__faq-bottom_text">{footer.text}</div>}
                {footer?.button?.title && footer?.button?.url && (
                  <Button className="home-page__faq-bottom_btn" withArrow={true} onClick={onClick}>
                    {footer.button.title}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {items && (
            <div className="home-page__faq-right">
              <FAQ items={items} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQPage;
