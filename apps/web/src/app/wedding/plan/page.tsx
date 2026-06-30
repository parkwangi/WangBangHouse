import { weddingPlanApi } from "@/api/server/plan";
import { getApiErrorMessage } from "@/api/error";
import { weddingPlanQueryOptions } from "@/queries/server/plan";

import { WeddingPlanCalendarPage } from "./_components/calendar-page";

import { mapKoreanHolidays } from "./_utils/holidays";
import { notFound } from "next/navigation";

export default async function WeddingPlanPage() {
  const currentYear = new Date().getFullYear();
  const [planResult, holidaysResult] = await Promise.allSettled([
    weddingPlanQueryOptions.data().queryFn(),
    weddingPlanApi.getKoreanHolidays(currentYear),
  ]);

  const errors: string[] = [];

  if (planResult.status === "rejected") {
    return notFound();
  }

  if (holidaysResult.status === "rejected") {
    return notFound();
  }

  const holidays = mapKoreanHolidays(holidaysResult.value);

  return (
    <WeddingPlanCalendarPage
      tasks={planResult.value.tasks}
      holidays={holidays}
      setupError={errors.length > 0 ? errors.join(" ") : null}
    />
  );
}
