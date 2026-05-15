"use client";

import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import { useRouter } from "next/navigation";

export default function ButtonCabinet() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <Button className="header__cabinet-button" onClick={handleClick}>
      <Icon className="header__cabinet-icon" name="user" />
      Личный кабинет
    </Button>
  );
}
