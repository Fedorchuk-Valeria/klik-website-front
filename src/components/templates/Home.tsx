import Image from "next/image";
import Link from "next/link";

import headerImg from "@/src/assets/images/templates/homepage/header.png";
import imgBlue from "@/src/assets/images/templates/homepage/programs/blue.jpg";
import imgGreen from "@/src/assets/images/templates/homepage/programs/green.jpg";
import imgPink from "@/src/assets/images/templates/homepage/programs/pink.jpg";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

import AboutUs from "@/src/components/template-parts/AboutUs";
import CookiePolicyListener from "@/src/components/template-parts/CookiePolicyListener";
import FAQPage from "@/src/components/template-parts/FAQ";
import Formats from "@/src/components/template-parts/Formats";
import HowSignUp from "@/src/components/template-parts/HowSignUp";
import Location from "@/src/components/template-parts/Location";
import PlaceListener from "@/src/components/template-parts/PlaceListener";
import SelectTraining from "@/src/components/template-parts/SelectTraining";
import SignUpFreeLesson from "@/src/components/template-parts/SignUpFreeLesson";
import Tutors from "@/src/components/template-parts/Tutors";
import WhatWeLearn from "@/src/components/template-parts/WhatWeLearn";
import WhyWeAre from "@/src/components/template-parts/WhyWeAre";

import { Page } from "@/src/lib/content/types";
import { PAGE_ANCHORS } from "@/src/utils/constant";

type Props = {
  page: Page;
};

export const programImages: Record<string, string> = {
  blue: imgBlue.src,
  pink: imgPink.src,
  green: imgGreen.src,
};

export default function Home({ page }: Props) {
  if (page.template !== "home") {
    throw new Error('Home: ожидался template "home"');
  }

  const header = page.content.header;
  const faq = page.content.faq;
  const formats = page.content.formats;
  const programs = page.content.programs;
  const whatWeLearn = page.content.what_we_learn;
  const whyWeAre = page.content.why_we_are;
  const tutors = page.content.our_tutors;
  const howSignUp = page.content.how_sign_up;
  const signUpFreeLesson = page.content.sign_up_free_lesson;
  const aboutUs = page.content.about_us;
  const selectTraining = page.content.select_training;
  const location = page.content.location;

  return (
    <main className="main home-page">
      <section id="header" className="home-page__header">
        <div className="header__container">
          <div className="home-page__header-wrapper">
            <h1>{page.seo.h1}</h1>
            {header ? (
              <div className="home-page__header-body">
                {header?.text && <div className="home-page__header-text">{header?.text}</div>}
                {header.button?.title && header.button?.url && (
                  <Button className="home-page__header-button" withArrow={true}>
                    {header.button?.title}
                  </Button>
                )}
              </div>
            ) : null}
            <Image className="home-page__header-img" src={headerImg} alt={page.seo.h1} />
          </div>
        </div>
      </section>

      {aboutUs && <AboutUs {...aboutUs} />}
      {formats && <Formats {...formats} />}

      <section className="home-page__block home-page__programs" id={PAGE_ANCHORS.PROGRAMS}>
        <div className="home-page__container">
          <div className="home-page__programs-wrapper">
            {programs?.tag && <div className="home-page__tag">{programs.tag}</div>}

            <div className="home-page__programs-top">
              {programs?.title && (
                <h2 className="home-page__h2 home-page__programs-title">{programs.title}</h2>
              )}
              {programs?.text && <div className="home-page__programs-text">{programs.text}</div>}
            </div>

            <div className="home-page__programs-body">
              {programs?.items.map((item: Record<string, string>, index: number) => {
                return (
                  <Link
                    className={`home-page__programs-item ${item?.class}`}
                    key={index}
                    href={"#"}
                  >
                    <div className="home-page__programs-item_top">
                      {item?.tag && <div className="home-page__programs-item_tag">{item.tag}</div>}
                      {item?.class && (
                        <Image
                          className="home-page__programs-item_image"
                          src={programImages[item.class]}
                          alt={item.title}
                          width={253}
                          height={193}
                        />
                      )}
                      {item?.quote && (
                        <div className="home-page__programs-item_quote">{item.quote}</div>
                      )}
                    </div>
                    <div className="home-page__programs-item_body">
                      {item?.title && (
                        <div className="home-page__programs-item_title">{item.title}</div>
                      )}
                      {item?.text && (
                        <div className="home-page__programs-item_text">{item.text}</div>
                      )}
                      <div className="home-page__programs-item_more">
                        <Icon className="home-page__programs-item_icon" name="arrow-long" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {selectTraining && <SelectTraining {...selectTraining} />}
      <WhatWeLearn {...whatWeLearn} />
      {howSignUp && <HowSignUp {...howSignUp} />}
      {location && <Location {...location} />}
      {whyWeAre && <WhyWeAre {...whyWeAre} />}
      {signUpFreeLesson && <SignUpFreeLesson {...signUpFreeLesson} />}
      <Tutors {...tutors} />
      {faq && <FAQPage {...faq} />}

      <CookiePolicyListener />
      <PlaceListener />
    </main>
  );
}
