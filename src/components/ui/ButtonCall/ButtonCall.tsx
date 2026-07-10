"use client";
import Button from "@/src/components/ui/Button/Button";
import HomeAnchorLink from "@/src/components/ui/HomeAnchorLink/HomeAnchorLink";
import { PAGE_ANCHORS } from "@/src/utils/constant";
import Icon from "@/src/components/ui/Icon/Icon";

export default function ButtonCall({ onClose }: { onClose?: () => void }) {
  return (
    <HomeAnchorLink anchor={PAGE_ANCHORS.SELECT_TRAINING} onClick={onClose}>
      <Button className="header__call-btn" variant="main-light">
        <Icon className="header__call-icon" name="calendar" />
        <span>Онлайн-запись</span>
      </Button>
    </HomeAnchorLink>
  );
}
