import type { FooterInfo } from "@/src/components/ui/Footer/Footer.types";
import Icon from "@/src/components/ui/Icon/Icon";
import { phoneToLink } from "@/src/lib/utils/phoneLink";
type FooterBlockProps = {
  item: FooterInfo;
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
        {item.type === "text" && <div dangerouslySetInnerHTML={{ __html: item.text }} />}

        {item.type === "phone" && <a href={phoneToLink(item.value)}>{item.value}</a>}

        {item.type === "email" && <a href={`mailto:${item.value}`}>{item.value}</a>}
      </div>
    </div>
  );
}
