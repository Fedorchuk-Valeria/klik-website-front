import {FC, memo, useEffect, useMemo, useRef, useState} from "react";
import Calendar from "react-calendar";
import classNames from "classnames";
import Icon from "@/src/components/ui/Icon/Icon";
import {useAppSelector} from "@/src/store/hooks";

type PropsDateRangeInput = {
  label: string;
  value: string;
  placeholder?: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  active?: boolean;
};

const DateRangeInput: FC<PropsDateRangeInput> = ({
   label,
   value,
   placeholder = "Дата от",
   onClick,
   className,
   disabled,
   active
 }) => {
  return (
    <div className={classNames("date-range__input", className, {"active": active, 'has-value': value})} onClick={onClick}>
      <Icon name="calendar" className="date-range__input-icon calendar" />
      <div className="date-range__input-body">
        <div className="date-range__input-label">{label}</div>
        <input
          readOnly
          value={value}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      <Icon name="arrow" className="date-range__input-icon arrow" />
    </div>
  );
};

type DateRangePickerProps = {
  className?: string;
  valueFrom: Date | null;
  valueTo: Date | null;
  onChange: (range: { from: Date | null; to: Date | null }) => void;
};

const DateRangePicker: FC<DateRangePickerProps> = ({ className, onChange, valueTo, valueFrom }) => {
  const [open, setOpen] = useState(false);
  const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (!ref.current?.contains(target)) {
        setOpen(false);
        setActiveInput(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (date: Date) => {
    if (activeInput === "from") {
      onChange({
        from: date,
        to: valueTo,
      });
    }

    if (activeInput === "to") {
      onChange({
        from: valueFrom,
        to: date,
      });
    }

    setOpen(false);
    setActiveInput(null);
  };

  const handleInputClick = (input: "from" | "to") => {
    if (activeInput === input) {
      setOpen(false);
      setActiveInput(null);
      return;
    }
    setActiveInput(input);
    setOpen(true);
  };

  return (
    <div className={classNames("date-range", className)} ref={ref}>
      <div className="date-range__inputs">
        <DateRangeInput
          label="Дата начала"
          value={valueFrom?.toLocaleDateString() || ""}
          placeholder="Выбрать дату"
          onClick={() => handleInputClick("from")}
          active={activeInput === "from"}
        />

        <DateRangeInput
          label="Дата конца"
          value={valueTo?.toLocaleDateString() || ""}
          placeholder="Выбрать дату"
          onClick={() => handleInputClick("to")}
          active={activeInput === "to"}
        />
      </div>

      {open && (
        <div className="date-range__calendar">
          <Calendar
            value={activeInput === "from" ? valueFrom : valueTo}
            onClickDay={handleSelect}
            minDate={activeInput === "to" ? (valueFrom ?? undefined) : undefined}
            maxDate={activeInput === "from" ? (valueTo ?? undefined) : undefined}
            tileClassName={({ date, view }) => {
              if (view !== "month") return null;

              const current = new Date(date).setHours(0, 0, 0, 0);
              const from = valueFrom ? new Date(valueFrom).setHours(0, 0, 0, 0) : null;
              const to = valueTo ? new Date(valueTo).setHours(0, 0, 0, 0) : null;
              const today = new Date().setHours(0, 0, 0, 0);

              if (from !== null && current === from) {
                return "selected";
              }
              if (to !== null && current === to) {
                return "selected";
              }

              if (from !== null && to !== null) {
                if (current < from || current > to) {
                  return "past";
                }
              } else if (from !== null) {
                if (current < from) {
                  return "past";
                }
              } else if (to !== null) {
                if (current > to) {
                  return "past";
                }
              }

              if (current === today) {
                return "today";
              }
              return null;
            }}
            formatMonthYear={(locale, date) => {
              const month = date
                .toLocaleDateString("ru-RU", { month: "long" })
                .replace(/^\p{L}/u, (c) => c.toUpperCase());

              const year = date.getFullYear();

              return `${month} ${year}`;
            }}
            prevLabel={<Icon name="arrow" className="date-range__calendar-icon" />}
            nextLabel={<Icon name="arrow" className="date-range__calendar-icon" />}
            prev2Label={<Icon name="arrow-double" className="date-range__calendar-icon" />}
            next2Label={<Icon name="arrow-double" className="date-range__calendar-icon" />}
          />
        </div>
      )}
    </div>
  );
};

export default memo(DateRangePicker);
