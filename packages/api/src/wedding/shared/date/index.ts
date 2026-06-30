import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

export function formatDateKey(date: dayjs.ConfigType) {
  return dayjs(date).format("YYYY-MM-DD");
}

export function formatMonthLabel(date: dayjs.ConfigType) {
  return dayjs(date).format("YYYY년 M월");
}

export function formatReadableDate(date: string | null) {
  if (!date) {
    return "날짜 없음";
  }

  return dayjs(date).format("YYYY년 M월 D일 (ddd)");
}

export function formatShortDate(date: string | null) {
  if (!date) {
    return "날짜 없음";
  }

  return dayjs(date).format("M월 D일 (ddd)");
}

export function getDday(date: string | null) {
  if (!date) {
    return null;
  }

  return dayjs(date).startOf("day").diff(dayjs().startOf("day"), "day");
}

export { dayjs };
