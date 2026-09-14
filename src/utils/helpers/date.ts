import * as DateFns from "date-fns";
import { format as fnsTzFormat, formatInTimeZone, getTimezoneOffset } from "date-fns-tz";

type DateCtx = string | number | Date;

function getWeek(date: Date) {
  if (!date) return [];

  const startWeek = DateFns.startOfWeek(date, { weekStartsOn: 1 });
  const week = [...Array(7)].fill(0).map((_, index) => {
    if (index === 0) return startWeek;

    return DateFns.addDays(startWeek, index);
  });

  return week;
}

function getDays(startDate: Date, count: number) {
  if (!startDate) return [];

  const dates = [...Array(count)].fill(0).map((_, index) => {
    if (index === 0) return startDate;

    return DateFns.addDays(startDate, index);
  });

  return dates;
}

const isSameDay = (dateLeft?: Date | number, dateRight?: Date | number): boolean => {
  if (dateLeft && dateRight) {
    return DateFns.isSameDay(dateLeft, dateRight);
  }

  return false;
};

const parse = (date: DateCtx, formatString = "yyyy-MM-dd") => {
  return typeof date === "string" ? DateFns.parse(date, formatString, new Date()) : date;
};

const parseISO = (date: DateCtx) => {
  return typeof date === "string" ? DateFns.parseISO(date) : date;
};

const eachDay = (start: Date | number, end: Date | number) =>
  DateFns.eachDayOfInterval({ start, end });

const toFormat = (date?: DateCtx, fmt = "dd/MM", tz?: string) => {
  return fnsTzFormat(parseISO(date ? new Date(date) : new Date()), fmt, {
    ...(tz && {
      timeZone: tz,
    }),
  });
};

const toFormatTimezone = (date: DateCtx, fmt: string, tz: string) => {
  return formatInTimeZone(date, tz, fmt);
};

const dayIsBefore = (date: Date | number, dateToCompare: Date | number) =>
  DateFns.isBefore(date, dateToCompare);

const dayIsAfter = (date: Date | number, dateToCompare: Date | number) =>
  DateFns.isAfter(date, dateToCompare);

const dayIsBetween = (date: Date | number, dateAfter: Date | number, dateBefore: Date | number) =>
  DateFns.isAfter(date, dateAfter) && DateFns.isBefore(date, dateBefore);

const addDay = (date: DateCtx, amount: number) => DateFns.addDays(parseISO(date), amount);

const differenceInMilliseconds = ({
  dateStrLeft,
  dateStrRight,
}: {
  dateStrLeft?: Date | string;
  dateStrRight?: Date | string;
}) =>
  DateFns.differenceInMilliseconds(
    dateStrLeft ? new Date(dateStrLeft) : new Date(),
    dateStrRight ? new Date(dateStrRight) : new Date()
  );

const addMinutes = (date: DateCtx, amount: number) => DateFns.addMinutes(parseISO(date), amount);
const addHours = (date: DateCtx, amount: number) => DateFns.addHours(parseISO(date), amount);
const addWeeks = (date: DateCtx, amount: number) => DateFns.addWeeks(parseISO(date), amount);
const addMonths = (date: DateCtx, amount: number) => DateFns.addMonths(parseISO(date), amount);
const addYears = (date: DateCtx, amount: number) => DateFns.addYears(parseISO(date), amount);
const startOfHour = (date: DateCtx) => DateFns.startOfHour(parseISO(date));
const endOfHour = (date: DateCtx) => DateFns.endOfHour(parseISO(date));

const startOfWeek = (date: DateCtx) => {
  return DateFns.startOfISOWeek(typeof date !== "string" ? date : new Date(date));
};

const endOfWeek = (date: DateCtx) => {
  return DateFns.endOfISOWeek(typeof date !== "string" ? date : new Date(date));
};

const startMonth = (date: DateCtx) => {
  return DateFns.startOfMonth(typeof date !== "string" ? date : new Date(date));
};

const endMonth = (date: DateCtx) => {
  return DateFns.endOfMonth(typeof date !== "string" ? date : new Date(date));
};

const getUnixDate = (date: DateCtx) => {
  return new Date(date).valueOf() + new Date().getTimezoneOffset() * 60000;
};

const toUTC = (date: Date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return date;
  }

  return addMinutes(date, date.getTimezoneOffset());
};

export default {
  toUTC,
  isSameDay,
  parse,
  eachDay,
  toFormat,
  dayIsBefore,
  dayIsAfter,
  dayIsBetween,
  addDay,
  addMonths,
  differenceInMilliseconds,
  addHours,
  addMinutes,
  startOfWeek,
  endOfWeek,
  startOfHour,
  endOfHour,
  getTimezoneOffset,
  toFormatTimezone,
  addYears,
  getUnixDate,
  addWeeks,
  startMonth,
  endMonth,
  getWeek,
  getDays,
};
