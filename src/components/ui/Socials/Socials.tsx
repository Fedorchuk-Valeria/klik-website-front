import Icon from "@/src/components/ui/Icon/Icon";

export type SocialItem = {
  icon: string;
  url: string;
};

type SocialsProps = {
  socials?: SocialItem[];
};

export default function Socials({ socials = [] }: SocialsProps) {
  if (socials.length == 0) {
    return;
  }

  return (
    <ul className="socials">
      {socials.map((item, index) => (
        <li className="socials__item" key={index}>
          <a className="socials__link" href={item.url} target="_blank">
            <Icon name={item.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
