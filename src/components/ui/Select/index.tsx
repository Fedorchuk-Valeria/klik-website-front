import classNames from "classnames";
import { FC, useRef, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";

import useClickOutside from "@/src/hooks/useClickOutside";

type PropTypes = {
  icon?: string;
  options: { id: string; name: string }[];
  selectedOption: { id: string; name: string };
  onChange: (option: { id: string; name: string }) => void;
  className?: string;
};

const Select: FC<PropTypes> = ({ options, selectedOption, icon, onChange, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const handleOptionSelect = (option: { id: string; name: string }) => () => {
    onChange(option);
    setOpen(false);
  };

  useClickOutside(ref, handleClose);

  return (
    <div
      ref={ref}
      className={classNames("select", className, {
        "select--open": isOpen,
      })}
    >
      <button type="button" className="select__current" onClick={toggleDropdown}>
        <span className="select__current-text">
          {!!icon && <Icon className="select__icon" name={icon} />}

          {selectedOption.name}
        </span>

        <span
          className={classNames("select__current-button", {
            "select__current-button--active": isOpen,
          })}
        >
          <Icon className="select__icon" name="arrow" />
        </span>
      </button>

      {isOpen && (
        <ul className="select__dropdown">
          {options.map((item) => {
            return (
              <li
                onClick={handleOptionSelect(item)}
                className={classNames("select__item", {
                  "select__item--active": item.id === selectedOption.id,
                })}
                key={item.id}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;
