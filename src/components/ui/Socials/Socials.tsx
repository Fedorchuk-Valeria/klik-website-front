import Icon from "@/src/components/ui/Icon/Icon";

type SocialItem = {
    url: string;
    name: string;
    icon: string;
};

export default function Socials() {
    const socials: SocialItem[] = [
        {
            url: '#',
            name: 'instagram',
            icon: 'inst',
        },
        {
            url: '#',
            name: 'tiktok',
            icon: 'tiktok',
        },
        {
            url: '#',
            name: 'telegram',
            icon: 'telegram',
        },
        {
            url: '#',
            name: 'vkontakte',
            icon: 'vk',
        },
    ];

    if (socials.length == 0) {
        return;
    }

    return (
        <ul className="socials">
            {socials.map((item, index) => (
                <li className="socials__item" key={index}>
                    <a className='socials__link' href={item.url} target='_blank'>
                        <Icon name={item.icon} />
                    </a>
                </li>
            ))}
        </ul>
    );
}