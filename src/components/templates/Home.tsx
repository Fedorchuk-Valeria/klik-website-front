import Image from "next/image";

import bannerDesktopImg from "@/src/assets/images/templates/homepage/banner_desktop.png";
import bannerTabletImg from "@/src/assets/images/templates/homepage/banner_tablet.png";

import Button from "@/src/components/ui/Button/Button";

import AboutUs from "@/src/components/template-parts/AboutUs";
import FAQPage from "@/src/components/template-parts/FAQ";
import Formats from "@/src/components/template-parts/Formats";
import HowSignUp from "@/src/components/template-parts/HowSignUp";
import Location from "@/src/components/template-parts/Location";
import Prices from "@/src/components/template-parts/Prices";
import Programs from "@/src/components/template-parts/Programs";
import SelectTraining from "@/src/components/template-parts/SelectTraining";
import SignUpFreeLesson from "@/src/components/template-parts/SignUpFreeLesson";
import Tutors from "@/src/components/template-parts/Tutors";
import WhatWeLearn from "@/src/components/template-parts/WhatWeLearn";
import WhyWeAre from "@/src/components/template-parts/WhyWeAre";

import { Page } from "@/src/lib/content/types";
import { getHomeLocations } from "@/src/lib/getLocations";
import { getHomePrices } from "@/src/lib/getPrices";

type Props = {
  page: Page;
};

export default async function Home({ page }: Props) {
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
  const location = await getHomeLocations(page.content.location);
  const prices = await getHomePrices(page.content.prices);

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
                  <a
                    href={"https://klik-holiday.by"}
                    className="home-page__header-button-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="home-page__header-button" withArrow={true}>
                      {header.button?.title}
                    </Button>
                  </a>
                )}
              </div>
            ) : null}

            <div className="home-page__header-img">
              <div className="home-page__header-img-layer home-page__header-img-layer--desktop">
                <Image src={bannerDesktopImg} alt={page.seo.h1} fill />
              </div>
              <div className="home-page__header-img-layer home-page__header-img-layer--tablet">
                <Image src={bannerTabletImg} alt={page.seo.h1} fill />
              </div>
            </div>
          </div>
        </div>
      </section>

      {aboutUs && <AboutUs {...aboutUs} />}
      {formats && <Formats {...formats} />}
      {selectTraining && <SelectTraining {...selectTraining} />}
      {programs && <Programs {...programs} />}
      <WhatWeLearn {...whatWeLearn} />
      {howSignUp && <HowSignUp {...howSignUp} />}
      {location && <Location {...location} />}
      {whyWeAre && <WhyWeAre {...whyWeAre} />}
      {signUpFreeLesson && <SignUpFreeLesson {...signUpFreeLesson} />}
      <Tutors {...tutors} />
      {prices && <Prices {...prices} />}
      {faq && <FAQPage {...faq} />}
    </main>
  );
}
