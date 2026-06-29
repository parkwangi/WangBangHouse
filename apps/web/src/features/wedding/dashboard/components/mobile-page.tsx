import { formatShortDate } from "@/features/wedding/shared/date/date-format";

import type { WeddingDashboardData } from "@/features/wedding/dashboard/types";

type DashboardMobilePageProps = {
  data: WeddingDashboardData;
  setupError: string | null;
};

export function DashboardMobilePage({
  data,
  setupError,
}: DashboardMobilePageProps) {
  return (
    <main className="px-4 py-5 pb-24">
      <div className="space-y-5">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-normal">
            Wedding Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            준비 현황을 빠르게 확인합니다.
          </p>
        </header>

        <section className="rounded-md border p-4">
          <p className="text-muted-foreground text-xs">Wedding Day</p>
          <p className="mt-1 text-2xl font-semibold">{formatDday(data.dday)}</p>
          <p className="text-muted-foreground text-sm">
            {formatDate(data.weddingDate)}
          </p>
        </section>

        {setupError ? <SetupNotice message={setupError} /> : null}

        <section className="grid grid-cols-2 gap-3">
          <Metric
            label="총 계약"
            value={formatCurrency(data.totalContractedAmount)}
          />
          <Metric
            label="결제 완료"
            value={formatCurrency(data.totalPaidAmount)}
          />
          <Metric label="미완료 할 일" value={`${data.incompleteTaskCount}`} />
          <Metric label="문서" value={`${data.documentCount}`} />
        </section>

        <Panel title="다가오는 할 일">
          {data.upcomingTasks.length > 0 ? (
            <div className="space-y-2">
              {data.upcomingTasks.map((task) => (
                <div key={task.id} className="bg-muted/30 rounded-md p-3">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {task.category} · {formatDate(task.dueDate)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyText>다가오는 할 일이 없습니다.</EmptyText>
          )}
        </Panel>

        <Panel title="다가오는 결제">
          {data.upcomingPayments.length > 0 ? (
            <div className="space-y-2">
              {data.upcomingPayments.map((payment) => (
                <div key={payment.id} className="bg-muted/30 rounded-md p-3">
                  <p className="font-medium">{payment.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {payment.category} · {formatDate(payment.paymentDueDate)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyText>다가오는 결제가 없습니다.</EmptyText>
          )}
        </Panel>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border min-w-0 rounded-md border p-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold">{value}</p>
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
    <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm">
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
    return "미정";
  }

  if (dday === 0) {
    return "D-Day";
  }

  return dday > 0 ? `D-${dday}` : `D+${Math.abs(dday)}`;
}
