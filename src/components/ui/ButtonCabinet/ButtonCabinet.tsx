"use client";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

export default function ButtonCabinet() {
  return (
    <Button className="header__cabinet-button">
      <Icon className="header__cabinet-icon" name="user" />
      <span>Личный кабинет</span>
    </Button>
  );
}
