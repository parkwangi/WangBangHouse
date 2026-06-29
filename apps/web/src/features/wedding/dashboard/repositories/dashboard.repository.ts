import "server-only";

import { pool } from "@/server/db/pool";

import { getDday } from "@/features/wedding/shared/date/date-format";

import type {
  DashboardPayment,
  DashboardTask,
  WeddingDashboardData,
} from "@/features/wedding/dashboard/types";

type WeddingProjectRow = {
  wedding_date: string | null;
  venue_name: string | null;
};

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
  due_date: string | null;
};

type UpcomingPaymentRow = {
  id: string;
  title: string;
  category: string;
  payment_due_date: string | null;
  contracted_amount: number | null;
  paid_amount: number;
};

type DashboardParams = {
  householdId: string;
  weddingProjectId: string;
};

export async function getWeddingDashboardData(
  params: DashboardParams,
): Promise<WeddingDashboardData> {
  const [
    project,
    budgetSummary,
    incompleteTaskCount,
    vendorCount,
    documentCount,
    upcomingTasks,
    upcomingPayments,
  ] = await Promise.all([
    getWeddingProject(params),
    getBudgetSummary(params),
    getIncompleteTaskCount(params),
    getVendorCount(params),
    getDocumentCount(params),
    getUpcomingTasks(params),
    getUpcomingPayments(params),
  ]);

  const totalContractedAmount = budgetSummary.totalContractedAmount;
  const totalPaidAmount = budgetSummary.totalPaidAmount;

  return {
    weddingDate: project.weddingDate,
    venueName: project.venueName,
    dday: getDday(project.weddingDate),
    totalEstimatedAmount: budgetSummary.totalEstimatedAmount,
    totalContractedAmount,
    totalPaidAmount,
    remainingAmount: Math.max(totalContractedAmount - totalPaidAmount, 0),
    incompleteTaskCount,
    vendorCount,
    documentCount,
    upcomingTasks,
    upcomingPayments,
  };
}

async function getWeddingProject(params: DashboardParams) {
  const result = await pool.query<WeddingProjectRow>(
    `
      select wedding_date, venue_name
      from wedding_projects
      where id = $1
        and household_id = $2
      limit 1
    `,
    [params.weddingProjectId, params.householdId],
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error("Wedding project was not found for this household.");
  }

  return {
    weddingDate: row.wedding_date,
    venueName: row.venue_name,
  };
}

async function getBudgetSummary(params: DashboardParams) {
  const result = await pool.query<BudgetSummaryRow>(
    `
      select
        coalesce(sum(wbi.estimated_amount), 0) as total_estimated_amount,
        coalesce(sum(wbi.contracted_amount), 0) as total_contracted_amount,
        coalesce(sum(wbi.paid_amount), 0) as total_paid_amount
      from wedding_budget_items wbi
      join wedding_projects wp on wp.id = wbi.wedding_project_id
      where wbi.wedding_project_id = $1
        and wp.household_id = $2
    `,
    [params.weddingProjectId, params.householdId],
  );

  const row = result.rows[0];

  return {
    totalEstimatedAmount: Number(row?.total_estimated_amount ?? 0),
    totalContractedAmount: Number(row?.total_contracted_amount ?? 0),
    totalPaidAmount: Number(row?.total_paid_amount ?? 0),
  };
}

async function getIncompleteTaskCount(params: DashboardParams) {
  const result = await pool.query<CountRow>(
    `
      select count(*) as count
      from wedding_tasks wt
      join wedding_projects wp on wp.id = wt.wedding_project_id
      where wt.wedding_project_id = $1
        and wp.household_id = $2
        and wt.status <> 'done'
    `,
    [params.weddingProjectId, params.householdId],
  );

  return Number(result.rows[0]?.count ?? 0);
}

async function getVendorCount(params: DashboardParams) {
  const result = await pool.query<CountRow>(
    `
      select count(*) as count
      from vendors
      where household_id = $1
    `,
    [params.householdId],
  );

  return Number(result.rows[0]?.count ?? 0);
}

async function getDocumentCount(params: DashboardParams) {
  const result = await pool.query<CountRow>(
    `
      select count(*) as count
      from documents
      where household_id = $1
    `,
    [params.householdId],
  );

  return Number(result.rows[0]?.count ?? 0);
}

async function getUpcomingTasks(params: DashboardParams) {
  const result = await pool.query<UpcomingTaskRow>(
    `
      select wt.id, wt.title, wt.category, wt.due_date
      from wedding_tasks wt
      join wedding_projects wp on wp.id = wt.wedding_project_id
      where wt.wedding_project_id = $1
        and wp.household_id = $2
        and wt.status <> 'done'
      order by wt.due_date nulls last, wt.created_at asc
      limit 5
    `,
    [params.weddingProjectId, params.householdId],
  );

  return result.rows.map(mapUpcomingTaskRow);
}

async function getUpcomingPayments(params: DashboardParams) {
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
      join wedding_projects wp on wp.id = wbi.wedding_project_id
      where wbi.wedding_project_id = $1
        and wp.household_id = $2
        and wbi.payment_due_date is not null
      order by wbi.payment_due_date asc, wbi.created_at asc
      limit 5
    `,
    [params.weddingProjectId, params.householdId],
  );

  return result.rows.map(mapUpcomingPaymentRow);
}

function mapUpcomingTaskRow(row: UpcomingTaskRow): DashboardTask {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    dueDate: row.due_date,
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
