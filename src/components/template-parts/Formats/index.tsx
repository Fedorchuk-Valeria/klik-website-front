import { FC } from "react";

import FormatsList from "@/src/components/template-parts/FormatsList/FormatsList";
import { FormatContentItem } from "@/src/lib/content/types";

type PropTypes = {
  tag?: string;
  title?: string;
  text?: string;
  items?: FormatContentItem[];
};

const Formats: FC<PropTypes> = ({ tag, title, text, items }) => {
  return (
    <section className="home-page__block home-page__formats" id="formats">
      <div className="home-page__container">
        <div className="home-page__formats-wrapper">
          {tag && <div className="home-page__tag">{tag}</div>}
          <div className="home-page__formats-top">
            {title && <h2 className="home-page__h2 home-page__formats-title">{title}</h2>}
            {text && <div className="home-page__formats-text">{text}</div>}
          </div>
          <div className="home-page__formats-body">
            <FormatsList items={items ?? []} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formats;
