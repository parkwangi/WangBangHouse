import { DashboardDesktopPage } from "@/features/wedding/dashboard/components/desktop-page";
import { DashboardMobilePage } from "@/features/wedding/dashboard/components/mobile-page";
import { getWeddingDashboardData } from "@/features/wedding/dashboard/repositories/dashboard.repository";
import { isMobileDevice } from "@/server/device/is-mobile-device";

import type { WeddingDashboardData } from "@/features/wedding/dashboard/types";

type DashboardPageData = {
  data: WeddingDashboardData;
  setupError: string | null;
};

const emptyDashboardData: WeddingDashboardData = {
  totalEstimatedAmount: 0,
  totalContractedAmount: 0,
  totalPaidAmount: 0,
  remainingAmount: 0,
  upcomingScheduleItemCount: 0,
  vendorCount: 0,
  documentCount: 0,
  upcomingScheduleItems: [],
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
    const data = await getWeddingDashboardData();

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
