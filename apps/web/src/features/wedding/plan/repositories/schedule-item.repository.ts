import "server-only";

import { pool } from "@/server/db/pool";

import type { WeddingScheduleItem } from "@/features/wedding/plan/types";

type WeddingScheduleItemRow = {
  id: string;
  title: string;
  category: string;
  scheduled_date: string | null;
  memo: string | null;
  created_at: Date;
  updated_at: Date;
};

type CreateWeddingScheduleItemParams = {
  title: string;
  category: string;
  scheduledDate?: string;
  memo?: string;
};

export async function getWeddingScheduleItems() {
  const result = await pool.query<WeddingScheduleItemRow>(
    `
      select wsi.*
      from wedding_schedule_items wsi
      order by wsi.scheduled_date nulls last, wsi.created_at asc
    `,
  );

  return result.rows.map(mapWeddingScheduleItemRow);
}

export async function createWeddingScheduleItem(
  params: CreateWeddingScheduleItemParams,
) {
  const result = await pool.query<WeddingScheduleItemRow>(
    `
      insert into wedding_schedule_items (
        title,
        category,
        scheduled_date,
        memo
      )
      values ($1, $2, $3, $4)
      returning *
    `,
    [
      params.title,
      params.category,
      params.scheduledDate ?? null,
      params.memo ?? null,
    ],
  );

  const scheduleItem = result.rows[0];

  if (!scheduleItem) {
    throw new Error("Wedding schedule item was not created.");
  }

  return mapWeddingScheduleItemRow(scheduleItem);
}

export async function deleteWeddingScheduleItem(params: {
  scheduleItemId: string;
}) {
  const result = await pool.query<Pick<WeddingScheduleItemRow, "id">>(
    `
      delete from wedding_schedule_items wsi
      where wsi.id = $1
      returning wsi.id
    `,
    [params.scheduleItemId],
  );

  if (!result.rows[0]) {
    throw new Error("Wedding schedule item was not found.");
  }
}

function mapWeddingScheduleItemRow(
  row: WeddingScheduleItemRow,
): WeddingScheduleItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    scheduledDate: row.scheduled_date,
    memo: row.memo,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
