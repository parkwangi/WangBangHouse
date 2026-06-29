import { WeddingPlanCalendarPage } from "@/features/wedding/plan/components/calendar-page";

import type { WeddingScheduleItem } from "@/features/wedding/plan/types";

type WeddingPlanDesktopPageProps = {
  tasks: WeddingScheduleItem[];
  setupError: string | null;
};

export function WeddingPlanDesktopPage(props: WeddingPlanDesktopPageProps) {
  return <WeddingPlanCalendarPage {...props} />;
}
