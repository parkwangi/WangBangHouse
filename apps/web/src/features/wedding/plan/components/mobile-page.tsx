import { WeddingPlanCalendarPage } from "@/features/wedding/plan/components/calendar-page";

import type { WeddingScheduleItem } from "@/features/wedding/plan/types";

type WeddingPlanMobilePageProps = {
  tasks: WeddingScheduleItem[];
  setupError: string | null;
};

export function WeddingPlanMobilePage(props: WeddingPlanMobilePageProps) {
  return <WeddingPlanCalendarPage {...props} compact />;
}
