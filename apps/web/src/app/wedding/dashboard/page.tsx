import { DashboardDesktopPage } from "@/features/wedding/dashboard/components/desktop-page";
import { DashboardMobilePage } from "@/features/wedding/dashboard/components/mobile-page";
import { getWeddingDashboardData } from "@/features/wedding/dashboard/repositories/dashboard.repository";
import { getCurrentWeddingProjectId } from "@/features/wedding/shared/server/get-current-wedding-project";
import { getCurrentHouseholdId } from "@/server/auth/get-current-household";
import { isMobileDevice } from "@/server/device/is-mobile-device";

import type { WeddingDashboardData } from "@/features/wedding/dashboard/types";

type DashboardPageData = {
  data: WeddingDashboardData;
  setupError: string | null;
};

const emptyDashboardData: WeddingDashboardData = {
  weddingDate: null,
  venueName: null,
  dday: null,
  totalEstimatedAmount: 0,
  totalContractedAmount: 0,
  totalPaidAmount: 0,
  remainingAmount: 0,
  incompleteTaskCount: 0,
  vendorCount: 0,
  documentCount: 0,
  upcomingTasks: [],
  upcomingPayments: [],
};

export default async function WeddingDashboardPage() {
  const [isMobile, pageData] = await Promise.all([
    isMobileDevice(),
    getDashboardPageData(),
  ]);

  if (isMobile) {
    return <DashboardMobilePage {...pageData} />;
  }

  return <DashboardDesktopPage {...pageData} />;
}

async function getDashboardPageData(): Promise<DashboardPageData> {
  try {
    const [householdId, weddingProjectId] = await Promise.all([
      getCurrentHouseholdId(),
      getCurrentWeddingProjectId(),
    ]);

    const data = await getWeddingDashboardData({
      householdId,
      weddingProjectId,
    });

    return {
      data,
      setupError: null,
    };
  } catch (error) {
    return {
      data: emptyDashboardData,
      setupError:
        error instanceof Error
          ? error.message
          : "Dashboard 데이터를 불러오지 못했습니다.",
    };
  }
}
