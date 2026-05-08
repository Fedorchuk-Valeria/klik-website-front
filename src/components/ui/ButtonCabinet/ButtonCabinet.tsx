"use client";
import Icon from "@/src/components/ui/Icon/Icon";
import Button from "@/src/components/ui/Button/Button";


export default function ButtonCabinet() {
  return (
    <Button className="header__cabinet-button">
      <Icon className="header__cabinet-icon" name="user" />
      Личный кабинет
    </Button>
  );
}
