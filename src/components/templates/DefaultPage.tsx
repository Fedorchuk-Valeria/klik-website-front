import {Page} from "@/src/lib/content/types";

type Props = {
    page: Page;
};
export default function DefaultPage({ page }: Props) {
    return (
        <main>
            <h1>{page.seo.h1}</h1>
        </main>
    );
}