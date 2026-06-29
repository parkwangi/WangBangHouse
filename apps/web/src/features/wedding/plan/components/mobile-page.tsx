import { WeddingPlanCalendarPage } from "@/features/wedding/plan/components/calendar-page";

import type { WeddingTask } from "@/features/wedding/plan/types";

type WeddingPlanMobilePageProps = {
  tasks: WeddingTask[];
  weddingProjectId: string | null;
  setupError: string | null;
};

export function WeddingPlanMobilePage(props: WeddingPlanMobilePageProps) {
  return <WeddingPlanCalendarPage {...props} compact />;
}
