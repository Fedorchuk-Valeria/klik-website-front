export type PageType = 'home' | 'page';

export type Page = {
    template: PageType;
    seo: {
        title: string;
        description: string;
        h1: string;
    };
    content: {
        [key: string]: any;
    }
};

export type MenuItem = {
    url: string;
    title: string;
};