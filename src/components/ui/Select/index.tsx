import classNames from "classnames";
import { FC, useEffect, useMemo, useRef, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";

import useClickOutside from "@/src/hooks/useClickOutside";

type Option = { id: string; name: string };

type BasePropTypes = {
  icon?: string;
  className?: string;
  color?: "green" | "orange";
};

type SingleSelectPropTypes = BasePropTypes & {
  multiple?: false;
  options: Option[];
  selectedOption: Option;
  onChange: (option: Option) => void;
};

type MultipleSelectPropTypes = BasePropTypes & {
  multiple: true;
  options: Option[];
  selectedOptions: Option[];
  onChange: (options: Option[]) => void;
  allOption?: Option;
  allOptionName?: string;
};

type PropTypes = SingleSelectPropTypes | MultipleSelectPropTypes;

const SELECT_ANIMATION_MS = 300;

type SelectViewPropTypes = BasePropTypes & {
  icon?: string;
  displayText: string;
  dropdownOptions: Option[];
  isOptionActive: (option: Option, index: number) => boolean;
  onOptionSelect: (option: Option, index: number) => void;
  closeOnSelect?: boolean;
};

const SelectView: FC<SelectViewPropTypes> = ({
  icon,
  className,
  color = "orange",
  displayText,
  dropdownOptions,
  isOptionActive,
  onOptionSelect,
  closeOnSelect = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [isOpen, setOpen] = useState(false);
  const [isClosing, setClosing] = useState(false);
  const hasOpenFrame = isOpen || isClosing;
  const dropdownKey = dropdownOptions.map((item) => item.id).join("|");

  const handleClose = () => {
    if (!isOpen || isClosing) {
      return;
    }

    setClosing(true);
    setOpen(false);

    closeTimerRef.current = setTimeout(() => {
      setClosing(false);
    }, SELECT_ANIMATION_MS);
  };

  const handleOpen = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    setClosing(false);
    setOpen(true);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      handleClose();
      return;
    }

    handleOpen();
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useClickOutside(ref, handleClose);

  return (
    <div
      ref={ref}
      className={classNames("select", className, {
        "select--open": hasOpenFrame,
        "select--closing": isClosing,
        "select--green": color === "green",
        "select--orange": color === "orange",
      })}
    >
      <button type="button" className="select__current" onClick={toggleDropdown}>
        <span className="select__current-text">
          {!!icon && <Icon className="select__icon" name={icon} />}

          {displayText}
        </span>

        <span
          className={classNames("select__current-button", {
            "select__current-button--active": isOpen,
          })}
        >
          <Icon className="select__icon" name="arrow" />
        </span>
      </button>

      <div
        className={classNames("select__dropdown-wrap", {
          "select__dropdown-wrap--open": isOpen,
        })}
        aria-hidden={!isOpen}
      >
        <div className="select__dropdown-inner">
          <ul key={dropdownKey} className="select__dropdown">
            {dropdownOptions.map((item, index) => {
              return (
                <li
                  onClick={() => {
                    onOptionSelect(item, index);

                    if (closeOnSelect) {
                      handleClose();
                    }
                  }}
                  className={classNames("select__item", {
                    "select__item--active": isOptionActive(item, index),
                  })}
                  key={item.id}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const SingleSelect: FC<SingleSelectPropTypes> = (props) => {
  const { options, selectedOption, onChange } = props;

  return (
    <SelectView
      {...props}
      closeOnSelect
      displayText={selectedOption.name}
      dropdownOptions={options}
      isOptionActive={(option) => option.id === selectedOption.id}
      onOptionSelect={(option) => onChange(option)}
    />
  );
};

const MultipleSelect: FC<MultipleSelectPropTypes> = (props) => {
  const { options, selectedOptions, onChange, allOption, allOptionName = "Все" } = props;

  const DEFAULT_ALL_OPTION = useMemo(() => ({ id: "all", name: allOptionName }), [allOptionName]);

  const dropdownOptions = [allOption || DEFAULT_ALL_OPTION, ...options];

  const displayText =
    selectedOptions.length === 0
      ? allOption?.name || DEFAULT_ALL_OPTION.name
      : selectedOptions.map((item) => item.name).join(", ");

  const isOptionActive = (option: Option, index: number) => {
    if (index === 0) {
      return selectedOptions.length === 0;
    }

    return selectedOptions.some((item) => item.id === option.id);
  };

  const handleOptionSelect = (option: Option, index: number) => {
    if (index === 0) {
      onChange([]);
      return;
    }

    const isSelected = selectedOptions.some((item) => item.id === option.id);

    if (isSelected) {
      onChange(selectedOptions.filter((item) => item.id !== option.id));
      return;
    }

    onChange([...selectedOptions, option]);
  };

  return (
    <SelectView
      {...props}
      displayText={displayText}
      dropdownOptions={dropdownOptions}
      isOptionActive={isOptionActive}
      onOptionSelect={handleOptionSelect}
    />
  );
};

const Select: FC<PropTypes> = (props) => {
  if (props.multiple) {
    return <MultipleSelect {...props} />;
  }

  return <SingleSelect {...props} />;
};

export default Select;
