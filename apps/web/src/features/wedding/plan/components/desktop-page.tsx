import { WeddingPlanCalendarPage } from "@/features/wedding/plan/components/calendar-page";

import type { WeddingTask } from "@/features/wedding/plan/types";

type WeddingPlanDesktopPageProps = {
  tasks: WeddingTask[];
  weddingProjectId: string | null;
  setupError: string | null;
};

export function WeddingPlanDesktopPage(props: WeddingPlanDesktopPageProps) {
  return <WeddingPlanCalendarPage {...props} />;
}
