import { BudgetItemForm } from "@/features/wedding/budget/components/budget-item-form";
import { formatShortDate } from "@/features/wedding/shared/date/date-format";

import type {
  BudgetItem,
  BudgetSummary,
} from "@/features/wedding/budget/types";

type WeddingBudgetDesktopPageProps = {
  items: BudgetItem[];
  summary: BudgetSummary;
  weddingProjectId: string | null;
  setupError: string | null;
};

export function WeddingBudgetDesktopPage({
  items,
  summary,
  weddingProjectId,
  setupError,
}: WeddingBudgetDesktopPageProps) {
  return (
    <main className="p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-normal">Budget</h1>
          <p className="text-muted-foreground">
            결혼 예산 항목과 결제 현황을 관리합니다.
          </p>
        </header>

        <SummaryGrid summary={summary} />

        {setupError ? <SetupNotice message={setupError} /> : null}

        <BudgetItemForm weddingProjectId={weddingProjectId} />

        <section className="border-border overflow-hidden rounded-md border">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr className="border-b text-left">
                <th className="w-[14%] px-4 py-3 font-medium">카테고리</th>
                <th className="w-[28%] px-4 py-3 font-medium">항목</th>
                <th className="w-[14%] px-4 py-3 text-right font-medium">
                  예상
                </th>
                <th className="w-[14%] px-4 py-3 text-right font-medium">
                  계약
                </th>
                <th className="w-[14%] px-4 py-3 text-right font-medium">
                  결제
                </th>
                <th className="w-[16%] px-4 py-3 font-medium">예정일</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 align-top">{item.category}</td>
                    <td className="px-4 py-3 align-top">
                      <p className="truncate font-medium">{item.title}</p>
                      {item.memo ? (
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                          {item.memo}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right align-top">
                      {formatCurrency(item.estimatedAmount)}
                    </td>
                    <td className="px-4 py-3 text-right align-top">
                      {formatCurrency(item.contractedAmount)}
                    </td>
                    <td className="px-4 py-3 text-right align-top">
                      {formatCurrency(item.paidAmount)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {formatPaymentDate(item.paymentDueDate)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="text-muted-foreground px-4 py-10 text-center"
                    colSpan={6}
                  >
                    아직 등록된 예산 항목이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}

function SummaryGrid({ summary }: { summary: BudgetSummary }) {
  return (
    <section className="grid gap-3 md:grid-cols-4">
      <SummaryCard label="총 예상" value={summary.totalEstimatedAmount} />
      <SummaryCard label="총 계약" value={summary.totalContractedAmount} />
      <SummaryCard label="결제 완료" value={summary.totalPaidAmount} />
      <SummaryCard label="남은 결제" value={summary.remainingAmount} />
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-border rounded-md border p-4">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-xl font-semibold">{formatCurrency(value)}</p>
    </div>
  );
}

function SetupNotice({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-4 py-3 text-sm">
      {message}
    </div>
  );
}

function formatCurrency(value: number | null) {
  if (value === null) {
    return "-";
  }

  return new Intl.NumberFormat("ko-KR").format(value);
}

function formatPaymentDate(date: string | null) {
  if (!date) {
    return "-";
  }

  return formatShortDate(date);
}
