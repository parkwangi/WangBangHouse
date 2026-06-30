import { formatShortDate } from "@repo/api/wedding/shared/date";

import type { WeddingDashboardData } from "@repo/api/wedding/dashboard/types";

type DashboardDesktopPageProps = {
  data: WeddingDashboardData;
  setupError: string | null;
};

export function DashboardDesktopPage({
  data,
  setupError,
}: DashboardDesktopPageProps) {
  return (
    <main className="p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-normal">
              Wedding Dashboard
            </h1>
            <p className="text-muted-foreground">
              결혼 준비 현황을 한 화면에서 확인합니다.
            </p>
          </div>
        </header>

        {setupError ? <SetupNotice message={setupError} /> : null}

        <section className="grid gap-3 md:grid-cols-4">
          <Metric
            label="총 예상"
            value={formatCurrency(data.totalEstimatedAmount)}
          />
          <Metric
            label="총 계약"
            value={formatCurrency(data.totalContractedAmount)}
          />
          <Metric
            label="결제 완료"
            value={formatCurrency(data.totalPaidAmount)}
          />
          <Metric
            label="남은 결제"
            value={formatCurrency(data.remainingAmount)}
          />
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <Metric
            label="다가오는 일정"
            value={`${data.upcomingScheduleItemCount}`}
          />
          <Metric label="업체" value={`${data.vendorCount}`} />
          <Metric label="문서" value={`${data.documentCount}`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Panel title="다가오는 일정 D-day">
            {data.upcomingScheduleItems.length > 0 ? (
              <div className="space-y-2">
                {data.upcomingScheduleItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-muted/30 flex items-start justify-between gap-3 rounded-md p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.category} · {formatDate(item.scheduledDate)}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold">
                      {formatDday(item.dday)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyText>다가오는 일정이 없습니다.</EmptyText>
            )}
          </Panel>

          <Panel title="다가오는 결제">
            {data.upcomingPayments.length > 0 ? (
              <div className="space-y-2">
                {data.upcomingPayments.map((payment) => (
                  <div key={payment.id} className="bg-muted/30 rounded-md p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{payment.title}</p>
                        <p className="text-muted-foreground text-sm">
                          {payment.category} ·{" "}
                          {formatDate(payment.paymentDueDate)}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-medium">
                        {formatCurrency(
                          Math.max(
                            (payment.contractedAmount ?? 0) -
                              payment.paidAmount,
                            0,
                          ),
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyText>다가오는 결제가 없습니다.</EmptyText>
            )}
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border rounded-md border p-4">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border rounded-md border p-4">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground text-sm">{children}</p>;
}

function SetupNotice({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-4 py-3 text-sm">
      {message}
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function formatDate(date: string | null) {
  if (!date) {
    return "날짜 없음";
  }

  return formatShortDate(date);
}

function formatDday(dday: number | null) {
  if (dday === null) {
    return "-";
  }

  if (dday === 0) {
    return "D-Day";
  }

  return dday > 0 ? `D-${dday}` : `D+${Math.abs(dday)}`;
}
