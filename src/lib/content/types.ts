export type PageType = "home" | "page" | "program";

export type PageSeo = {
  title: string;
  description: string;
  h1: string;
};

export type LinkButton = {
  title: string;
  url: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FormatContentItem = {
  title: string;
  url: string;
  class: string;
  text: string;
  tag?: string;
  list?: {
    icon: string;
    title: string;
  }[];
};

export type ProgramContentItem = {
  title: string;
  url: string;
  class: string;
  quote?: string;
  text?: string;
  tag?: string;
  id?: string;
};

type WhatWeLearnContentItem = {
  title: string;
  key: string;
  text: string;
  items: string[];
};

type WhyWeAreContentItem = {
  id: string;
  title: string;
  text: string;
  star: number;
  fullName: string;
  position: string;
  createdAt: string;
};

type TutorContentItem = {
  id: string;
  name: string;
  position: string;
  text: string;
  location: string;
  tags: string[];
};

type HowSignUpContentItem = {
  id: number;
  title: string;
  subtitle: string;
  text: string;
  isButton?: boolean;
  button?: {
    title: string;
    variant: string;
  };
  isDropdown?: boolean;
  list?: {
    icon_variant: string;
    items: string[];
  };
  dropdown?: {
    title: string;
    text: string;
  }[];
};

type SignUpFreeLessonContentItem = {
  id: number;
  title: string;
  text: string;
};

/** Поля `content` для главной (`home.json`). Секции опциональны — зависят от CMS. */
export type HomePageContent = {
  location?: {
    tag?: string;
    title?: string;
  };
  select_training?: {
    tag?: string;
    title?: string;
    text?: string;
    items?: { title: string; text: string }[];
  };
  about_us?: {
    tag?: string;
    title?: string;
    text?: string;
    subtitle?: string;
    items?: AboutUsContentItem[];
    slides?: AboutUsSlideContentItem[];
  };
  header?: {
    text?: string;
    button?: LinkButton;
  };
  formats?: {
    tag?: string;
    title?: string;
    text?: string;
    items: FormatContentItem[];
  };
  programs?: {
    tag?: string;
    title?: string;
    text?: string;
    items: ProgramContentItem[];
  };
  faq?: {
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
  what_we_learn?: {
    tag?: string;
    title?: string;
    text?: string;
    items?: WhatWeLearnContentItem[];
  };
  why_we_are?: {
    tag: string;
    title: string;
    text: string;
    items: WhyWeAreContentItem[];
    info: {
      rating: string;
      blocks: string;
      recommended: string;
      format: string;
    };
  };
  our_tutors?: {
    tag?: string;
    title?: string;
    text?: string;
    items?: TutorContentItem[];
  };
  how_sign_up?: {
    tag: string;
    title: string;
    text: string;
    items: HowSignUpContentItem[];
  };
  sign_up_free_lesson?: {
    tag?: string;
    title: string;
    text: string;
    items: SignUpFreeLessonContentItem[];
    form?: {
      title: string;
      text: string;
    };
  };
};

export type AboutUsContentItem = {
  icon: string;
  color: string;
  title: string;
  text: string;
};

export type AboutUsSlideContentItem = {
  id: number;
  title: string;
  tag: string;
  link: string;
  type: string;
  image?: number;
};

export type ProgramPageContent = {
  tag: string;
  color: string;
  title: string;
  text: string;
  items: ProgramPageBaseContentItem[];
};

type ProgramPageBaseContentItem = {
  title: string;
  text: string;
  number: string;
  image?: string;
};

export type HomePage = {
  template: "home";
  seo: PageSeo;
  content: HomePageContent;
};

export type ProgramPage = {
  template: "program";
  seo: PageSeo;
  content: ProgramPageContent;
};

export type GenericPage = {
  template: "page";
  seo: PageSeo;
  content: unknown;
};

export type Page = HomePage | GenericPage | ProgramPage;

export type MenuItem = {
  url?: string;
  title: string;
  action?: string;
};
