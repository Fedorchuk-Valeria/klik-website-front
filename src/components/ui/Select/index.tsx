import classNames from "classnames";
import { FC, KeyboardEvent, useCallback, useEffect, useId, useRef, useState } from "react";

import Checkbox from "@/src/components/ui/Checkbox";
import Icon from "@/src/components/ui/Icon/Icon";

import useClickOutside from "@/src/hooks/useClickOutside";

type Option = { id: string; name: string };

type BasePropTypes = {
  icon?: string;
  className?: string;
  color?: "green" | "orange";
  isAbsolute?: boolean;
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
  placeholder?: string;
};

type PropTypes = SingleSelectPropTypes | MultipleSelectPropTypes;

const SELECT_ANIMATION_MS = 300;
const DEFAULT_ALL_OPTION_ID = "all";

type SelectViewPropTypes = BasePropTypes & {
  displayText: string;
  dropdownOptions: Option[];
  isOptionActive: (option: Option) => boolean;
  onOptionSelect: (option: Option) => void;
  closeOnSelect?: boolean;
  multiple?: boolean;
};

const SelectView: FC<SelectViewPropTypes> = ({
  icon,
  className,
  color = "orange",
  isAbsolute = false,
  displayText,
  dropdownOptions,
  isOptionActive,
  onOptionSelect,
  closeOnSelect = false,
  multiple = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isOpenRef = useRef(false);
  const isClosingRef = useRef(false);
  const listboxId = useId();
  const [isOpen, setOpen] = useState(false);
  const [isClosing, setClosing] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const hasOpenFrame = isOpen || isClosing;

  const handleClose = useCallback(() => {
    if (!isOpenRef.current || isClosingRef.current) {
      return;
    }

    isOpenRef.current = false;
    isClosingRef.current = true;
    setClosing(true);
    setOpen(false);

    closeTimerRef.current = setTimeout(() => {
      isClosingRef.current = false;
      setClosing(false);
    }, SELECT_ANIMATION_MS);
  }, []);

  const handleOpen = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    isClosingRef.current = false;
    isOpenRef.current = true;
    setClosing(false);
    setOpen(true);
    setFocusedIndex(0);
  }, []);

  const toggleDropdown = () => {
    if (isOpen) {
      handleClose();
      return;
    }

    handleOpen();
  };

  const selectOption = (option: Option) => {
    onOptionSelect(option);

    if (closeOnSelect) {
      handleClose();
    }
  };

  const focusOption = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, dropdownOptions.length - 1));

    setFocusedIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!isOpen) {
        handleOpen();
        return;
      }

      focusOption(0);
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      handleClose();
    }
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    index: number,
    option: Option
  ) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        focusOption(index + 1);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        focusOption(index - 1);
        break;
      }
      case "Home": {
        event.preventDefault();
        focusOption(0);
        break;
      }
      case "End": {
        event.preventDefault();
        focusOption(dropdownOptions.length - 1);
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        selectOption(option);
        break;
      }
      case "Escape": {
        event.preventDefault();
        handleClose();
        break;
      }
      default:
        break;
    }
  };

  // Sync open state into a ref for stable close handlers.
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Sync closing animation state into a ref for stable close handlers.
  useEffect(() => {
    isClosingRef.current = isClosing;
  }, [isClosing]);

  // Clear the close-animation timer on unmount.
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Close the dropdown on Escape while it is open.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, handleClose]);

  // Move focus to the first option when the dropdown opens.
  useEffect(() => {
    if (isOpen) {
      optionRefs.current[0]?.focus();
    }
  }, [isOpen]);

  useClickOutside(ref, handleClose);

  return (
    <div
      ref={ref}
      className={classNames("select", className, {
        "select--open": hasOpenFrame,
        "select--closing": isClosing,
        "select--absolute": isAbsolute,
        "select--multiple": multiple,
        "select--green": color === "green",
        "select--orange": color === "orange",
      })}
    >
      <button
        type="button"
        className="select__current"
        onClick={toggleDropdown}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
      >
        <span className="select__current-text">
          {!!icon && <Icon className="select__icon" name={icon} />}

          <span className="select__current-label">{displayText}</span>
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
        aria-hidden={!hasOpenFrame}
      >
        <div className="select__dropdown-inner">
          <ul
            id={listboxId}
            className="select__dropdown"
            role="listbox"
            aria-multiselectable={multiple || undefined}
            tabIndex={-1}
          >
            {dropdownOptions.map((item, index) => {
              const isActive = isOptionActive(item);

              return (
                <li
                  key={item.id}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  tabIndex={isOpen && focusedIndex === index ? 0 : -1}
                  aria-selected={isActive}
                  onClick={() => selectOption(item)}
                  onKeyDown={(event) => handleOptionKeyDown(event, index, item)}
                  onFocus={() => setFocusedIndex(index)}
                  className={classNames("select__item", {
                    "select__item--active": isActive,
                  })}
                >
                  {multiple && (
                    <Checkbox
                      readOnly
                      tabIndex={-1}
                      checked={isActive}
                      className="select__item-checkbox"
                      aria-hidden
                    />
                  )}

                  <span className="select__item-text">{item.name}</span>
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
  const {
    options,
    selectedOptions,
    onChange,
    allOption,
    allOptionName = "Все",
    placeholder = "Выбор вариантов",
  } = props;

  const resolvedAllOption = allOption ?? { id: DEFAULT_ALL_OPTION_ID, name: allOptionName };
  const dropdownOptions = [resolvedAllOption, ...options];
  const isAllSelected = selectedOptions.length === options.length && options.length > 0;
  const isDefaultState = selectedOptions.length === 0;

  const displayText = isDefaultState
    ? placeholder
    : isAllSelected
      ? resolvedAllOption.name
      : selectedOptions.map((item) => item.name).join(", ");

  const isOptionActive = (option: Option) => {
    if (option.id === resolvedAllOption.id) {
      return isAllSelected;
    }

    if (isAllSelected) {
      return true;
    }

    return selectedOptions.some((item) => item.id === option.id);
  };

  const handleOptionSelect = (option: Option) => {
    if (option.id === resolvedAllOption.id) {
      if (isAllSelected) {
        onChange([]);
        return;
      }

      onChange([...options]);
      return;
    }

    const isSelected = isAllSelected || selectedOptions.some((item) => item.id === option.id);

    if (isAllSelected) {
      onChange(options.filter((item) => item.id !== option.id));
      return;
    }

    if (isSelected) {
      onChange(selectedOptions.filter((item) => item.id !== option.id));
      return;
    }

    const newSelected = [...selectedOptions, option];

    if (newSelected.length === options.length) {
      onChange([...options]);
      return;
    }

    onChange(newSelected);
  };

  return (
    <SelectView
      {...props}
      multiple
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
