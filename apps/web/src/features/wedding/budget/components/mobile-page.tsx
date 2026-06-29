import { CalendarDays } from "lucide-react";

import { BudgetItemForm } from "@/features/wedding/budget/components/budget-item-form";
import { formatShortDate } from "@/features/wedding/shared/date/date-format";

import type {
  BudgetItem,
  BudgetSummary,
} from "@/features/wedding/budget/types";

type WeddingBudgetMobilePageProps = {
  items: BudgetItem[];
  summary: BudgetSummary;
  weddingProjectId: string | null;
  setupError: string | null;
};

export function WeddingBudgetMobilePage({
  items,
  summary,
  weddingProjectId,
  setupError,
}: WeddingBudgetMobilePageProps) {
  return (
    <main className="px-4 py-5 pb-24">
      <div className="space-y-5">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-normal">Budget</h1>
          <p className="text-muted-foreground text-sm">
            예산과 결제 상태를 빠르게 확인합니다.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3">
          <SummaryCard label="총 계약" value={summary.totalContractedAmount} />
          <SummaryCard label="결제 완료" value={summary.totalPaidAmount} />
          <SummaryCard label="총 예상" value={summary.totalEstimatedAmount} />
          <SummaryCard label="남은 결제" value={summary.remainingAmount} />
        </section>

        {setupError ? <SetupNotice message={setupError} /> : null}

        <BudgetItemForm weddingProjectId={weddingProjectId} />

        <section className="space-y-3">
          {items.length > 0 ? (
            items.map((item) => <BudgetItemCard key={item.id} item={item} />)
          ) : (
            <div className="text-muted-foreground bg-muted/20 rounded-md p-4 text-sm">
              아직 등록된 예산 항목이 없습니다.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function BudgetItemCard({ item }: { item: BudgetItem }) {
  return (
    <article className="border-border bg-background space-y-3 rounded-md border p-4">
      <div>
        <p className="text-muted-foreground text-sm">{item.category}</p>
        <h2 className="truncate font-semibold">{item.title}</h2>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <Amount label="예상" value={item.estimatedAmount} />
        <Amount label="계약" value={item.contractedAmount} />
        <Amount label="결제" value={item.paidAmount} />
      </div>

      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <CalendarDays className="size-4" aria-hidden="true" />
        {formatDate(item.paymentDueDate)}
      </div>

      {item.memo ? (
        <p className="bg-muted/30 rounded-md p-3 text-sm">{item.memo}</p>
      ) : null}
    </article>
  );
}

function Amount({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="bg-muted/30 min-w-0 rounded-md p-2">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="truncate font-medium">{formatCurrency(value)}</p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-border min-w-0 rounded-md border p-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold">
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function SetupNotice({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm">
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

function formatDate(date: string | null) {
  if (!date) {
    return "결제 예정일 없음";
  }

  return formatShortDate(date);
}
