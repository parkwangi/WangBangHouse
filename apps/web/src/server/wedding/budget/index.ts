import "server-only";

import { pool } from "@/server/db/pool";

import type {
  BudgetItem,
  BudgetSummary,
} from "@repo/api/wedding/budget/types";

type BudgetItemRow = {
  id: string;
  vendor_id: string | null;
  category: string;
  title: string;
  estimated_amount: number;
  contracted_amount: number | null;
  paid_amount: number;
  payment_due_date: string | null;
  memo: string | null;
  created_at: Date;
  updated_at: Date;
};

type BudgetSummaryRow = {
  total_estimated_amount: string | null;
  total_contracted_amount: string | null;
  total_paid_amount: string | null;
};

type CreateBudgetItemParams = {
  category: string;
  title: string;
  estimatedAmount: number;
  contractedAmount?: number;
  paidAmount: number;
  paymentDueDate?: string;
  memo?: string;
};

export async function getWeddingBudgetPageData() {
  const [items, summary] = await Promise.all([
    getBudgetItems(),
    getBudgetSummary(),
  ]);

  return { items, summary };
}

export async function getBudgetItems() {
  const result = await pool.query<BudgetItemRow>(
    `
      select wbi.*
      from wedding_budget_items wbi
      order by wbi.payment_due_date nulls last, wbi.created_at asc
    `,
  );

  return result.rows.map(mapBudgetItemRow);
}

export async function createBudgetItem(params: CreateBudgetItemParams) {
  const result = await pool.query<BudgetItemRow>(
    `
      insert into wedding_budget_items (
        category,
        title,
        estimated_amount,
        contracted_amount,
        paid_amount,
        payment_due_date,
        memo
      )
      values ($1, $2, $3, $4, $5, $6, $7)
      returning *
    `,
    [
      params.category,
      params.title,
      params.estimatedAmount,
      params.contractedAmount ?? null,
      params.paidAmount,
      params.paymentDueDate ?? null,
      params.memo ?? null,
    ],
  );

  const item = result.rows[0];

  if (!item) {
    throw new Error("Budget item was not created.");
  }

  return mapBudgetItemRow(item);
}

async function getBudgetSummary(): Promise<BudgetSummary> {
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
  const totalContractedAmount = Number(row?.total_contracted_amount ?? 0);
  const totalPaidAmount = Number(row?.total_paid_amount ?? 0);

  return {
    totalEstimatedAmount: Number(row?.total_estimated_amount ?? 0),
    totalContractedAmount,
    totalPaidAmount,
    remainingAmount: Math.max(totalContractedAmount - totalPaidAmount, 0),
  };
}

function mapBudgetItemRow(row: BudgetItemRow): BudgetItem {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    category: row.category,
    title: row.title,
    estimatedAmount: row.estimated_amount,
    contractedAmount: row.contracted_amount,
    paidAmount: row.paid_amount,
    paymentDueDate: row.payment_due_date,
    memo: row.memo,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
