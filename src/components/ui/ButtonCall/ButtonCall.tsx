"use client";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

type Props = {
  href?: string;
  onClose?: () => void;
};

export default function ButtonCall({ href, onClose }: Props) {
  if (!href) return null;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClose}>
      <Button className="header__call-btn" variant="main-light">
        <Icon className="header__call-icon" name="calendar" />
        <span>Онлайн-запись</span>
      </Button>
    </a>
  );
}
