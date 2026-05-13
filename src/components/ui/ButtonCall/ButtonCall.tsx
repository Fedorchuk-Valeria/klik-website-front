"use client";
import Button from "@/src/components/ui/Button/Button";
import { PAGE_ANCHORS } from "@/src/utils/constant";

export default function ButtonCall() {
  return (
    <a href={`#${PAGE_ANCHORS.SELECT_TRAINING}`}>
      <Button className="header__call" variant="main-light">
        Записаться
      </Button>
    </a>
  );
}
