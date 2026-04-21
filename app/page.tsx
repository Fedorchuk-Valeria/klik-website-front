import {headers} from "next/headers";
import {notFound} from "next/navigation";
import {getPage} from "@/src/lib/getPage";
import {resolveTemplate} from "@/src/lib/resolveTemplate";

export async function generateMetadata() {
    const h = await headers();

    const city = h.get('x-city');
    const slug = 'home';

    if (!city) return {};

    const page = getPage(city, slug);

    if (!page) return {};

    return {
        title: page.seo.title,
        description: page.seo.description,
        openGraph: {
            title: page.seo.title,
            description: page.seo.description
        }
    };
}

export default async function Page() {
    const h = await headers();

    const city = h.get('x-city');
    const slug = 'home';

    if (!city) {
        notFound();
    }

    const page = getPage(city, slug);

    if (!page) {
        notFound();
    }

    const Template = resolveTemplate(page.template);

    return <Template page={page} />;
}