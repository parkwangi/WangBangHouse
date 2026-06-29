import { WeddingPlanDesktopPage } from "@/features/wedding/plan/components/desktop-page";
import { WeddingPlanMobilePage } from "@/features/wedding/plan/components/mobile-page";
import { getWeddingScheduleItems } from "@/features/wedding/plan/repositories/schedule-item.repository";
import { isMobileDevice } from "@/server/device/is-mobile-device";

import type { WeddingScheduleItem } from "@/features/wedding/plan/types";

type WeddingPlanData = {
  tasks: WeddingScheduleItem[];
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
    const tasks = await getWeddingScheduleItems();

    return {
      tasks,
      setupError: null,
    };
  } catch (error) {
    return {
      tasks: [],
      setupError:
        error instanceof Error
          ? error.message
          : "Wedding Plan 데이터를 불러오지 못했습니다.",
    };
  }
}
