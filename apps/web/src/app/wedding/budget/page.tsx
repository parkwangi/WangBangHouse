import { WeddingBudgetDesktopPage } from "@/app/wedding/budget/_components/desktop-page";
import { getApiErrorMessage } from "@/api/error";
import { weddingBudgetQueryOptions } from "@/queries/server/budget";

import type { BudgetItem, BudgetSummary } from "@repo/api/wedding/budget/types";

type WeddingBudgetData = {
  items: BudgetItem[];
  summary: BudgetSummary;
  setupError: string | null;
};

const emptySummary: BudgetSummary = {
  totalEstimatedAmount: 0,
  totalContractedAmount: 0,
  totalPaidAmount: 0,
  remainingAmount: 0,
};

export default async function WeddingBudgetPage() {
  const data = await getWeddingBudgetData();

  return <WeddingBudgetDesktopPage {...data} />;
}

async function getWeddingBudgetData(): Promise<WeddingBudgetData> {
  try {
    const data = await weddingBudgetQueryOptions.pageData().queryFn();

    return {
      ...data,
      setupError: null,
    };
  } catch (error) {
    return {
      items: [],
      summary: emptySummary,
      setupError: await getApiErrorMessage(
        error,
        "Budget 데이터를 불러오지 못했습니다.",
      ),
    };
  }
}
