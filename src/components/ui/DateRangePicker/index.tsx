import { FC, memo, useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import classNames from "classnames";
import Icon from "@/src/components/ui/Icon/Icon";

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
    <div className={classNames("date-range__input", className, {"active": active})} onClick={onClick}>
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

  return (
    <div className={classNames("date-range", className)} ref={ref}>
      <div className="date-range__inputs">
        <DateRangeInput
          label="Дата начала"
          value={valueFrom?.toLocaleDateString() || ""}
          placeholder="Выбрать дату"
          onClick={() => {
            setActiveInput("from");
            setOpen(true);
          }}
          active={activeInput === "from"}
        />

        <DateRangeInput
          label="Дата конца"
          value={valueTo?.toLocaleDateString() || ""}
          placeholder="Выбрать дату"
          onClick={() => {
            setActiveInput("to");
            setOpen(true);
          }}
          active={activeInput === "to"}
        />
      </div>

      {open && (
        <div className="date-range__calendar">
          <Calendar
            value={activeInput === "from" ? valueFrom : valueTo}
            onClickDay={handleSelect}
            tileClassName={({ date, view }) => {
              if (view !== "month") return null;

              const current = new Date(date).setHours(0, 0, 0, 0);

              const from = valueFrom
                ? new Date(valueFrom).setHours(0, 0, 0, 0)
                : null;

              const to = valueTo
                ? new Date(valueTo).setHours(0, 0, 0, 0)
                : null;

              const today = new Date().setHours(0, 0, 0, 0);

              if (from && current === from) {
                return "from";
              }

              if (to && current === to) {
                return "to";
              }

              if (current < today) {
                return "past";
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
