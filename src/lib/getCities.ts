import {APPLICATION_MODE, ROOT_DOMAIN} from "@/src/lib/env";

export type City = {
    slug: string;
    name: string;
    url: string;
};

export function getCities(): City[] {

    const protocol = APPLICATION_MODE === 'local' ? "http://" : "https://";

    return [
        { slug: 'minsk', name: 'Минск', url: protocol + ROOT_DOMAIN },
        { slug: 'borisov', name: 'Борисов', url: `${protocol}borisov.${ROOT_DOMAIN}` },
        { slug: 'novopolotsk', name: 'Новополоцк', url: `${protocol}novopolotsk.${ROOT_DOMAIN}` },
        { slug: 'baranovichi', name: 'Барановичи', url: `${protocol}baranovichi.${ROOT_DOMAIN}` }];
}