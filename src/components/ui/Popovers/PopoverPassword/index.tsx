import Popover from "@/src/components/ui/Popover";
import Icon from "@/src/components/ui/Icon/Icon";

export default function PopoverPassword({}) {
  return (
    <Popover
      id="password-popover"
      variant="click"
      positionX="right"
      positionY="bottom-end"
      popoverClassName="password-popover-list"
      content={
        <ul>
          <li>Минимальная длина — 8 символов.</li>
          <li>Минимум 1 заглавная буква.</li>
          <li>Минимум 1 строчная буква.</li>
          <li>Минимум 1 специальный символ.</li>
          <li>Минимум 1 цифра.</li>
        </ul>
      }
    >
      <Icon name="info-circle-outline" />
    </Popover>
  );
}
