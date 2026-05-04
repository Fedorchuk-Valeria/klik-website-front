import Icon from "@/src/components/ui/Icon/Icon";
import { City } from "@/src/lib/getCities";
type FooterBlockProps = {
  item: {
    title: string;
    icon: string;
    text?: string;
    list?: City[];
  };
};

export default function FooterBlock({ item }: FooterBlockProps) {
  return (
    <div className="footer__block">
      <div className="footer__block-header">
        <div className="footer__block-icon">
          <Icon name={item.icon} />
        </div>
        <div className="footer__block-title">{item.title}</div>
      </div>

      <div className="footer__block-body">
        {item.text && <div dangerouslySetInnerHTML={{ __html: item.text }} />}
        {item.list && (
          <ul className="footer__block-list">
            {item.list.map((city, index) => (
              <li key={index}>
                <a href={city.url}>{city.name}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
