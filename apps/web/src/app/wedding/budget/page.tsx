import { WeddingBudgetDesktopPage } from "@/features/wedding/budget/components/desktop-page";
import { WeddingBudgetMobilePage } from "@/features/wedding/budget/components/mobile-page";
import { getWeddingBudgetPageData } from "@/features/wedding/budget/repositories/budget.repository";
import { getCurrentWeddingProjectId } from "@/features/wedding/shared/server/get-current-wedding-project";
import { getCurrentHouseholdId } from "@/server/auth/get-current-household";
import { isMobileDevice } from "@/server/device/is-mobile-device";

import type {
  BudgetItem,
  BudgetSummary,
} from "@/features/wedding/budget/types";

type WeddingBudgetData = {
  items: BudgetItem[];
  summary: BudgetSummary;
  weddingProjectId: string | null;
  setupError: string | null;
};

const emptySummary: BudgetSummary = {
  totalEstimatedAmount: 0,
  totalContractedAmount: 0,
  totalPaidAmount: 0,
  remainingAmount: 0,
};

export default async function WeddingBudgetPage() {
  const [isMobile, data] = await Promise.all([
    isMobileDevice(),
    getWeddingBudgetData(),
  ]);

  if (isMobile) {
    return <WeddingBudgetMobilePage {...data} />;
  }

  return <WeddingBudgetDesktopPage {...data} />;
}

async function getWeddingBudgetData(): Promise<WeddingBudgetData> {
  try {
    const [householdId, weddingProjectId] = await Promise.all([
      getCurrentHouseholdId(),
      getCurrentWeddingProjectId(),
    ]);

    const data = await getWeddingBudgetPageData({
      householdId,
      weddingProjectId,
    });

    return {
      ...data,
      weddingProjectId,
      setupError: null,
    };
  } catch (error) {
    return {
      items: [],
      summary: emptySummary,
      weddingProjectId: null,
      setupError:
        error instanceof Error
          ? error.message
          : "Budget 데이터를 불러오지 못했습니다.",
    };
  }
}
