import Icon from "@/src/components/ui/Icon/Icon";
import {phoneToLink} from "@/src/lib/utils/phoneLink";
import {FooterInfo} from "@/src/components/ui/Footer/Footer";
type FooterBlockProps = {
  item: FooterInfo
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
        {item.type === "text" && (
          <div dangerouslySetInnerHTML={{ __html: item.text }} />
        )}

        {item.type === "cities" && (
          <ul className="footer__block-list">
            {item?.list.map((city) => (
              <li key={city.slug}>
                <a href={city.url}>{city.name}</a>
              </li>
            ))}
          </ul>
        )}

        {item.type === "phone" && (
          <a href={phoneToLink(item.value)}>
            {item.value}
          </a>
        )}

        {item.type === "email" && (
          <a href={`mailto:${item.value}`}>
            {item.value}
          </a>
        )}
      </div>
    </div>
  );
}
