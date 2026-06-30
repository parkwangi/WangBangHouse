import { DashboardDesktopPage } from "@/app/wedding/dashboard/_components/desktop-page";
import { getApiErrorMessage } from "@/api/error";
import { weddingDashboardQueryOptions } from "@/queries/server/dashboard";

import type { WeddingDashboardData } from "@repo/api/wedding/dashboard/types";

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
  const pageData = await getDashboardPageData();

  return <DashboardDesktopPage {...pageData} />;
}

async function getDashboardPageData(): Promise<DashboardPageData> {
  try {
    const data = await weddingDashboardQueryOptions.data().queryFn();

    return {
      data,
      setupError: null,
    };
  } catch (error) {
    return {
      data: emptyDashboardData,
      setupError: await getApiErrorMessage(
        error,
        "Dashboard 데이터를 불러오지 못했습니다.",
      ),
    };
  }
}
