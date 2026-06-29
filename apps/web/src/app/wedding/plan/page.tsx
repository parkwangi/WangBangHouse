import { WeddingPlanDesktopPage } from "@/features/wedding/plan/components/desktop-page";
import { WeddingPlanMobilePage } from "@/features/wedding/plan/components/mobile-page";
import { getWeddingTasks } from "@/features/wedding/plan/repositories/task.repository";
import { getCurrentWeddingProjectId } from "@/features/wedding/shared/server/get-current-wedding-project";
import { getCurrentHouseholdId } from "@/server/auth/get-current-household";
import { isMobileDevice } from "@/server/device/is-mobile-device";

import type { WeddingTask } from "@/features/wedding/plan/types";

type WeddingPlanData = {
  tasks: WeddingTask[];
  weddingProjectId: string | null;
  setupError: string | null;
};

export default async function WeddingPlanPage() {
  const [isMobile, data] = await Promise.all([
    isMobileDevice(),
    getWeddingPlanData(),
  ]);

  if (isMobile) {
    return <WeddingPlanMobilePage {...data} />;
  }

  return <WeddingPlanDesktopPage {...data} />;
}

async function getWeddingPlanData(): Promise<WeddingPlanData> {
  try {
    const [householdId, weddingProjectId] = await Promise.all([
      getCurrentHouseholdId(),
      getCurrentWeddingProjectId(),
    ]);

    const tasks = await getWeddingTasks({
      householdId,
      weddingProjectId,
    });

    return {
      tasks,
      weddingProjectId,
      setupError: null,
    };
  } catch (error) {
    return {
      tasks: [],
      weddingProjectId: null,
      setupError:
        error instanceof Error
          ? error.message
          : "Wedding Plan 데이터를 불러오지 못했습니다.",
    };
  }
}
