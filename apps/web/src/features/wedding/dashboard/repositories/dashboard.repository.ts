import "server-only";

import { pool } from "@/server/db/pool";

import { getDday } from "@/features/wedding/shared/date/date-format";

import type {
  DashboardPayment,
  DashboardScheduleItem,
  WeddingDashboardData,
} from "@/features/wedding/dashboard/types";

type BudgetSummaryRow = {
  total_estimated_amount: string | null;
  total_contracted_amount: string | null;
  total_paid_amount: string | null;
};

type CountRow = {
  count: string;
};

type UpcomingTaskRow = {
  id: string;
  title: string;
  category: string;
  scheduled_date: string | null;
};

type UpcomingPaymentRow = {
  id: string;
  title: string;
  category: string;
  payment_due_date: string | null;
  contracted_amount: number | null;
  paid_amount: number;
};

export async function getWeddingDashboardData(): Promise<WeddingDashboardData> {
  const [
    budgetSummary,
    upcomingScheduleItemCount,
    vendorCount,
    documentCount,
    upcomingScheduleItems,
    upcomingPayments,
  ] = await Promise.all([
    getBudgetSummary(),
    getUpcomingScheduleItemCount(),
    getVendorCount(),
    getDocumentCount(),
    getUpcomingScheduleItems(),
    getUpcomingPayments(),
  ]);

  const totalContractedAmount = budgetSummary.totalContractedAmount;
  const totalPaidAmount = budgetSummary.totalPaidAmount;

  return {
    totalEstimatedAmount: budgetSummary.totalEstimatedAmount,
    totalContractedAmount,
    totalPaidAmount,
    remainingAmount: Math.max(totalContractedAmount - totalPaidAmount, 0),
    upcomingScheduleItemCount,
    vendorCount,
    documentCount,
    upcomingScheduleItems,
    upcomingPayments,
  };
}

async function getBudgetSummary() {
  const result = await pool.query<BudgetSummaryRow>(
    `
      select
        coalesce(sum(wbi.estimated_amount), 0) as total_estimated_amount,
        coalesce(sum(wbi.contracted_amount), 0) as total_contracted_amount,
        coalesce(sum(wbi.paid_amount), 0) as total_paid_amount
      from wedding_budget_items wbi
    `,
  );

  const row = result.rows[0];

  return {
    totalEstimatedAmount: Number(row?.total_estimated_amount ?? 0),
    totalContractedAmount: Number(row?.total_contracted_amount ?? 0),
    totalPaidAmount: Number(row?.total_paid_amount ?? 0),
  };
}

async function getUpcomingScheduleItemCount() {
  const result = await pool.query<CountRow>(
    `
      select count(*) as count
      from wedding_schedule_items wsi
      where wsi.scheduled_date is not null
        and wsi.scheduled_date >= current_date
    `,
  );

  return Number(result.rows[0]?.count ?? 0);
}

async function getVendorCount() {
  const result = await pool.query<CountRow>(
    `
      select count(*) as count
      from vendors
    `,
  );

  return Number(result.rows[0]?.count ?? 0);
}

async function getDocumentCount() {
  const result = await pool.query<CountRow>(
    `
      select count(*) as count
      from documents
    `,
  );

  return Number(result.rows[0]?.count ?? 0);
}

async function getUpcomingScheduleItems() {
  const result = await pool.query<UpcomingTaskRow>(
    `
      select wsi.id, wsi.title, wsi.category, wsi.scheduled_date
      from wedding_schedule_items wsi
      where wsi.scheduled_date is not null
        and wsi.scheduled_date >= current_date
      order by wsi.scheduled_date asc, wsi.created_at asc
      limit 5
    `,
  );

  return result.rows.map(mapUpcomingScheduleItemRow);
}

async function getUpcomingPayments() {
  const result = await pool.query<UpcomingPaymentRow>(
    `
      select
        wbi.id,
        wbi.title,
        wbi.category,
        wbi.payment_due_date,
        wbi.contracted_amount,
        wbi.paid_amount
      from wedding_budget_items wbi
      where wbi.payment_due_date is not null
      order by wbi.payment_due_date asc, wbi.created_at asc
      limit 5
    `,
  );

  return result.rows.map(mapUpcomingPaymentRow);
}

function mapUpcomingScheduleItemRow(
  row: UpcomingTaskRow,
): DashboardScheduleItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    scheduledDate: row.scheduled_date,
    dday: getDday(row.scheduled_date),
  };
}

function mapUpcomingPaymentRow(row: UpcomingPaymentRow): DashboardPayment {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    paymentDueDate: row.payment_due_date,
    contractedAmount: row.contracted_amount,
    paidAmount: row.paid_amount,
  };
}
