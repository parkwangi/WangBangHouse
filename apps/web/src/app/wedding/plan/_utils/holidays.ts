import { KoreanHoliday } from "@repo/api/wedding/plan/schema";

export function mapKoreanHolidays(response: KoreanHoliday) {
  return response.response.body.items.item
    .filter((holiday) => holiday.isHoliday === "Y")
    .map((holiday) => ({
      date: formatLocdate(holiday.locdate),
      name: holiday.dateName,
    }));
}

function formatLocdate(locdate: number) {
  const value = String(locdate);

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}
